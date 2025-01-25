import {
  Address,
  Channel,
  LightConfig,
  LightID,
  makeChannel,
  makeLightID,
  makeUniverse,
  Universe,
  UniverseChannel,
} from '@spencer516/drama-led-messages/src/AddressTypes';
import {z} from 'zod';
import Light from './Light';
import {range} from './utils';
import {Sender} from 'sacn';
import {LightChannel} from './LightChannel';
import LightMapping from './LightMapping';

const IPAddress = z
  .string()
  .ip({version: 'v4'})
  .brand('IPAddress');

const MaxLights = z.number().min(0).max(680);

const LIGHTS_PER_UNIVERSE = Math.floor(512 / 3);

const SACN_NETWORK_INTERFACE = '192.168.1.1';

type OutputNumber = '1' | '2';

type OctoConfig = {
  id: string;
  ipAddress: string;
  outputNumber: OutputNumber;
  startUniverse: number;
  dmxStartAddress?: number;
  numberOfLights: number; // Max 680
  lightMapping: LightMapping;
  sacnNetworkInterface: string;
};

function getUniverseChannelMaker(
  startUniverse: Universe,
  dmxStartAddress: Channel,
  sequenceNumber: number,
): (offset: number) => UniverseChannel {
  return offset => {
    const universeOffset = Math.floor(sequenceNumber / LIGHTS_PER_UNIVERSE);
    const universe = startUniverse + universeOffset;
    const sequenceInUniverse = sequenceNumber % LIGHTS_PER_UNIVERSE;

    const channel = sequenceInUniverse * 3 + offset + 1;

    return [makeUniverse(universe), makeChannel(channel)];
  };
}

export default class OctoController {
  #id: string;
  #ipAddress: z.infer<typeof IPAddress>;
  #lights: Light[];
  #outputNumber: OutputNumber;
  #universes: Map<Universe, LightChannel[]> = new Map();
  #sacnSenders: Map<Universe, Sender> = new Map();
  #sacnNetworkInterface: string;

  constructor({
    id,
    ipAddress,
    outputNumber,
    startUniverse,
    dmxStartAddress,
    numberOfLights,
    lightMapping,
    sacnNetworkInterface,
  }: OctoConfig) {
    this.#id = id;
    this.#outputNumber = outputNumber;
    this.#ipAddress = IPAddress.parse(ipAddress);
    this.#sacnNetworkInterface = IPAddress.parse(sacnNetworkInterface);

    const universe = makeUniverse(startUniverse);
    const startAddress =
      dmxStartAddress == null
        ? makeChannel(1)
        : makeChannel(dmxStartAddress);

    this.#lights = range(
      0,
      MaxLights.parse(numberOfLights),
    ).map(sequenceNumber => {
      const makeChannelByOffset = getUniverseChannelMaker(
        universe,
        startAddress,
        sequenceNumber,
      );

      const lightID = this.makeLightID(sequenceNumber + 1);
      const coordinates =
        lightMapping.getLightCoordinates(lightID);

      const light = new Light(lightID, coordinates, [
        makeChannelByOffset(0),
        makeChannelByOffset(1),
        makeChannelByOffset(2),
      ]);

      this.indexLightChannels(light);

      return light;
    });
  }

  makeLightID(sequenceNumber: number): LightID {
    return makeLightID(
      `${this.#id}:${this.#outputNumber}-${sequenceNumber}`,
    );
  }

  indexLightChannels(light: Light): void {
    for (const lightChannel of light.toLightChannels()) {
      const universe = lightChannel.universe;

      if (!this.#universes.has(universe)) {
        this.#universes.set(universe, []);
      }

      this.#universes.get(universe)?.push(lightChannel);
    }
  }

  setupSacnSenders() {
    for (const universe of this.#universes.keys()) {
      this.#sacnSenders.set(
        universe,
        new Sender({
          universe: universe,
          iface: this.#sacnNetworkInterface,
          reuseAddr: true
        }),
      );
    }
  }

  broadcast() {
    for (const [universe, lightChannels] of this
      .#universes) {
      const payload = lightChannels.reduce<{
        [channel: string]: number;
      }>((acc, lightChannel) => {
        acc[lightChannel.channel] = lightChannel.value;
        return acc;
      }, {});

      const sender = this.#sacnSenders.get(universe);

      sender
        ?.send({
          payload,
          sourceName: 'Drama LED Server',
          priority: 200,
        })
        .catch(err =>
          console.error('Error Sending SACN', err),
        );
    }
  }

  get id() {
    return this.#id;
  }

  get universes() {
    return this.#universes;
  }

  get ipAddress() {
    return this.#ipAddress;
  }

  get lights(): Light[] {
    return this.#lights;
  }

  get outputNumber() {
    return this.#outputNumber;
  }

  toLightConfigs(): LightConfig[] {
    return this.#lights.map(light => light.toLightConfig());
  }

  toAddresses(): Address[] {
    return this.#lights.flatMap(light =>
      light.toAddresses(),
    );
  }
}
