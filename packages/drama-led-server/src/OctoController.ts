import {
  Address,
  LightConfig,
  LightID,
  makeLightID,
  makeUniverse,
  Universe,
  OctoControllerStatus
} from '@spencer516/drama-led-messages';
import { z } from 'zod';
import Light from './Light';
import { checkSACNSocket, getUniverseChannelMaker, range } from './utils';
import { Sender } from 'sacn';
import { LightChannel } from './LightChannel';
import LightMapping from './LightMapping';
import Broadcaster from './Broadcaster';

const IPAddress = z.string().ip({ version: 'v4' }).brand('IPAddress');

const MaxLights = z.number().min(0).max(680);

type OutputNumber = '1' | '2';

type OctoConfig = {
  id: string;
  ipAddress: string;
  outputNumber: OutputNumber;
  startUniverse: number;
  lightMapping: LightMapping;
  sacnNetworkInterface: string;
  isReversedDirection: boolean;
};

export default class OctoController {
  #id: string;
  #ipAddress: z.infer<typeof IPAddress>;
  #lights: Light[];
  #outputNumber: OutputNumber;
  #universes: Map<Universe, LightChannel[]> = new Map();
  #sacnSenders: Map<Universe, Sender> = new Map();
  #sacnNetworkInterface: string;
  #connectionError: string | null = null;

  constructor({
    id,
    ipAddress,
    outputNumber,
    startUniverse,
    lightMapping,
    sacnNetworkInterface,
    isReversedDirection,
  }: OctoConfig) {
    this.#id = id;
    this.#outputNumber = outputNumber;
    this.#ipAddress = IPAddress.parse(ipAddress);
    this.#sacnNetworkInterface = IPAddress.parse(sacnNetworkInterface);

    const universe = makeUniverse(startUniverse);

    const countLights = lightMapping.getCountOfLightsForPrefix(
      `${id}:${outputNumber}`,
    );

    // Make sure there's at least one light.
    const lights = range(0, MaxLights.parse(Math.max(countLights, 1))).map(
      (sequenceNumber) => {
        const makeChannelByOffset = getUniverseChannelMaker(
          universe,
          sequenceNumber,
        );

        const lightID = this.makeLightID(sequenceNumber + 1);
        const coordinates = lightMapping.getLightCoordinates(lightID);

        const light = new Light(lightID, coordinates, [
          makeChannelByOffset(0),
          makeChannelByOffset(1),
          makeChannelByOffset(2),
        ]);

        this.indexLightChannels(light);

        return light;
      },
    );

    this.#lights = isReversedDirection ? lights.reverse() : lights;
  }

  makeLightID(sequenceNumber: number): LightID {
    return makeLightID(`${this.#id}:${this.#outputNumber}-${sequenceNumber}`);
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

  async setupSacnSenders(_broadcaster: Broadcaster) {
    // We need to attempt to connect to the socket before we create
    // the new sender so we can handle errors.
    try {
      this.#connectionError = null;
      await checkSACNSocket(this.#sacnNetworkInterface);

      for (const universe of this.#universes.keys()) {
        this.#sacnSenders.set(
          universe,
          new Sender({
            universe: universe,
            iface: this.#sacnNetworkInterface,
            reuseAddr: true,
          }),
        );
      }
    } catch (err: unknown) {
      this.#connectionError = String(err);
    }
  }

  stopSacnSenders() {
    for (const sender of this.#sacnSenders.values()) {
      sender.close();
    }

    this.#sacnSenders = new Map();
  }

  broadcast() {
    for (const [universe, lightChannels] of this.#universes) {
      const payload: { [channel: string]: number } = {};

      for (const { channel, value } of lightChannels) {
        payload[channel] = value;
      }

      const sender = this.#sacnSenders.get(universe);

      sender
        ?.send({
          payload,
          sourceName: 'Drama LED Server',
          priority: 200,
        })
        .catch((err) => console.error('Error Sending SACN', err));
    }
  }

  get id() {
    return `${this.#id}:${this.#outputNumber}`;
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

  get status(): OctoControllerStatus {
    const lights = this.#lights;
    const onLights = lights.filter((light) => light.isOn);

    const firstLight = lights.at(0);
    const lastLight = lights.at(-1);

    if (firstLight == null || lastLight == null) {
      throw new Error('Could not find first or last light');
    }

    return {
      id: this.id,
      ipAddress: this.ipAddress,
      isSACNEnabled: this.#sacnSenders.size > 0,
      numberOfLights: lights.length,
      numberOfLightsOn: onLights.length,
      connectionError: this.#connectionError,
      universeRange: [firstLight.universe, lastLight.universe],
    };
  }

  toLightConfigs(): LightConfig[] {
    return this.#lights.map((light) => light.toLightConfig());
  }

  toAddresses(): Address[] {
    return this.#lights.flatMap((light) => light.toAddresses());
  }
}
