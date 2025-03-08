import {
  LightID,
  makeLightID,
  makeUniverse,
  Universe,
  GledoptoControllerStatus,
  GledoptoSACNStatus,
} from '@spencer516/drama-led-messages';
import Light from './Light';
import { checkSACNSocket, getUniverseChannelMaker, range } from './utils';

import { Sender } from 'sacn';
import { getIPForInterface, getIPAddressForHost } from './network';
import Broadcaster from './Broadcaster';
import LightMapping from './LightMapping';

type GledoptoControllerConfig = {
  id: string;
  host: string;
  startUniverse: number;
  numberOfLights: number;
  lightMapping: LightMapping;
};

export default class GledoptoController {
  #host: string;
  #id: string;
  #universe: Universe;
  #lights: Light[];
  #sacnSender: Sender | null = null;
  #sacnStatus: GledoptoSACNStatus = 'disconnected';
  #connectionError: string | null = null;

  constructor(config: GledoptoControllerConfig) {
    this.#host = config.host;
    this.#id = config.id;

    this.#universe = makeUniverse(config.startUniverse);

    this.#lights = range(0, config.numberOfLights).map((sequenceNumber) => {
      const makeChannelByOffset = getUniverseChannelMaker(
        this.#universe,
        sequenceNumber,
      );

      const lightID = this.makeLightID(sequenceNumber + 1);
      const coordinates = config.lightMapping.getLightCoordinates(lightID);

      const light = new Light(lightID, coordinates, [
        makeChannelByOffset(0),
        makeChannelByOffset(1),
        makeChannelByOffset(2),
      ]);

      return light;
    });
  }

  makeLightID(sequenceNumber: number): LightID {
    return makeLightID(`${this.#id}:${sequenceNumber}`);
  }

  async setupSacnSenders(broadcaster: Broadcaster) {
    try {
      this.#connectionError = null;
      this.#sacnStatus = 'connecting';

      broadcaster.broadcastGledoptosStatus();

      const iface = getIPForInterface('en0');
      await checkSACNSocket(iface);
      const ipAddress = await getIPAddressForHost(this.#host);

      this.#sacnSender = new Sender({
        universe: this.#universe,
        iface,
        reuseAddr: true,
        useUnicastDestination: ipAddress,
      });
      this.#sacnStatus = 'connected';
    } catch (err: unknown) {
      this.#connectionError = String(err);
      this.#sacnStatus = 'disconnected';
    }
  }

  stopSacnSenders() {
    if (this.#sacnSender) {
      this.#sacnSender.close();
    }

    this.#sacnSender = null;
    this.#sacnStatus = 'disconnected';
  }

  broadcast() {
    const payload: { [channel: string]: number } = {};

    for (const light of this.#lights) {
      for (const { channel, value } of light.toLightChannels()) {
        payload[channel] = value;
      }
    }

    this.#sacnSender?.send({
      payload,
      sourceName: 'Drama LED Server',
      priority: 200,
    });
  }

  get id() {
    return this.#id;
  }

  get lights() {
    return this.#lights;
  }

  get status(): GledoptoControllerStatus {
    const onLights = this.#lights.filter((light) => light.isOn);
    return {
      id: this.#id,
      host: this.#host,
      numberOfLights: this.#lights.length,
      numberOfLightsOn: onLights.length,
      sacnStatus: this.#sacnStatus,
      universe: this.#universe,
      connectionError: this.#connectionError,
    };
  }
}
