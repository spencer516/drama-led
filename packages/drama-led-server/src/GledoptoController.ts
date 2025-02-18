import {
  LightID,
  makeLightID,
  makeUniverse,
  Universe,
} from '@spencer516/drama-led-messages/src/AddressTypes';
import Light from './Light';
import { checkSACNSocket, getUniverseChannelMaker, range } from './utils';
import { getIPForInterface } from './network';
import { Sender } from 'sacn';
import { GledoptoControllerStatus } from '@spencer516/drama-led-messages/src/OutputMessage';

type GledoptoControllerConfig = {
  id: string;
  host: string;
  startUniverse: number;
};

const WIFI_INTERFACE = getIPForInterface('en1');

export default class GledoptoController {
  #host: string;
  #id: string;
  #universe: Universe;
  #lights: Light[];
  #sacnSender: Sender | null = null;
  #connectionError: string | null = null;

  constructor(config: GledoptoControllerConfig) {
    this.#host = config.host;
    this.#id = config.id;

    this.#universe = makeUniverse(config.startUniverse);

    this.#lights = range(0, 10).map((sequenceNumber) => {
      const makeChannelByOffset = getUniverseChannelMaker(
        this.#universe,
        sequenceNumber,
      );

      const lightID = this.makeLightID(sequenceNumber + 1);

      const light = new Light(
        lightID,
        {
          x: 0,
          y: 0,
        },
        [
          makeChannelByOffset(0),
          makeChannelByOffset(1),
          makeChannelByOffset(2),
        ],
      );

      return light;
    });
  }

  makeLightID(sequenceNumber: number): LightID {
    return makeLightID(`${this.#id}:${sequenceNumber}`);
  }

  async setupSacnSender() {
    try {
      this.#connectionError = null;
      await checkSACNSocket(WIFI_INTERFACE);
      this.#sacnSender = new Sender({
        universe: this.#universe,
        iface: WIFI_INTERFACE,
        reuseAddr: true,
      });
    } catch (err: unknown) {
      this.#connectionError = String(err);
    }
  }

  stopSacnSender() {
    if (this.#sacnSender) {
      this.#sacnSender.close();
    }

    this.#sacnSender = null;
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
    return {
      id: this.#id,
      host: this.#host,
      numberOfLights: this.#lights.length,
      isSACNEnabled: this.#sacnSender !== null,
      universe: this.#universe,
      connectionError: this.#connectionError,
    };
  }
}
