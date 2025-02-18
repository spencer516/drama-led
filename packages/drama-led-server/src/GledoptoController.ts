import {
  LightID,
  makeLightID,
  makeUniverse,
  Universe,
} from '@spencer516/drama-led-messages/src/AddressTypes';
import Light from './Light';
import { checkSACNSocket, getUniverseChannelMaker, range } from './utils';

import { Sender } from 'sacn';
import {
  GledoptoControllerStatus,
  GledoptoSACNStatus,
} from '@spencer516/drama-led-messages/src/OutputMessage';
import { getIPForInterface, getIPAddressForHost } from './network';
import Broadcaster from './Broadcaster';

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
  #sacnStatus: GledoptoSACNStatus = 'disconnected';
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

  async setupSacnSenders(broadcaster: Broadcaster) {
    try {
      this.#connectionError = null;
      this.#sacnStatus = 'connecting';

      console.log('CONNECTING!', this.status);
      broadcaster.broadcastPartial({
        gledoptos: [this.status],
      });

      await checkSACNSocket(WIFI_INTERFACE);
      const ipAddress = await getIPAddressForHost(this.#host);

      this.#sacnSender = new Sender({
        universe: this.#universe,
        iface: WIFI_INTERFACE,
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
