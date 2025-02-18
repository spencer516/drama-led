import { LightConfig } from '@spencer516/drama-led-messages/src/AddressTypes';
import OctoController from './OctoController';
import Light from './Light';
import {
  GledoptoControllerStatus,
  OctoControllerStatus,
  QLabReceiverStatus,
} from '@spencer516/drama-led-messages/src/OutputMessage';
import GledoptoController from './GledoptoController';
import QLabReceiver from './QLabReceiver';
import MessageHandler from './MessageHandler';
import Broadcaster from './Broadcaster';

export const SACN_NETWORK_INTERFACE = '192.168.1.199';

export default class LEDSystem {
  #octoControllers: Map<string, OctoController>;
  #gledOptoControllers: Map<string, GledoptoController>;
  #qlabReceiver: QLabReceiver;

  constructor(
    qlabReceiver: QLabReceiver,
    octoControllers: OctoController[],
    gledOptoControllers: GledoptoController[],
  ) {
    this.#octoControllers = new Map();
    this.#gledOptoControllers = new Map();
    this.#qlabReceiver = qlabReceiver;

    for (const octoController of octoControllers) {
      this.#octoControllers.set(octoController.id, octoController);
    }

    for (const gledOptoController of gledOptoControllers) {
      this.#gledOptoControllers.set(gledOptoController.id, gledOptoController);
    }
  }

  broadcast(): void {
    for (const controller of this.#octoControllers.values()) {
      controller.broadcast();
    }

    for (const controller of this.#gledOptoControllers.values()) {
      controller.broadcast();
    }
  }

  getNetworkInterface(): string {
    return SACN_NETWORK_INTERFACE;
  }

  toLightConfigs(): LightConfig[] {
    const configs = [];

    for (const [_, light] of this.getLightsIterator()) {
      configs.push(light.toLightConfig());
    }

    return configs;
  }

  toOctoControllerStatus(): OctoControllerStatus[] {
    return Array.from(this.#octoControllers.values()).map(
      (controller) => controller.status,
    );
  }

  toGledOptoControllerStatus(): GledoptoControllerStatus[] {
    return Array.from(this.#gledOptoControllers.values()).map(
      (controller) => controller.status,
    );
  }

  get countLights(): number {
    const lightsArray = Array.from(this.getLightsIterator());
    return lightsArray.length;
  }

  *getLightsIterator(
    controllerID: string | null = null,
  ): Generator<[number, Light]> {
    if (controllerID == null) {
      let index = 0;
      for (const [_, controller] of this.#octoControllers) {
        for (const light of controller.lights) {
          yield [index++, light];
        }
      }

      for (const [_, controller] of this.#gledOptoControllers) {
        for (const light of controller.lights) {
          yield [index++, light];
        }
      }
    } else {
      const controller = this.#getControllerById(controllerID);
      if (controller == null) {
        return;
      }

      let index = 0;
      for (const light of controller.lights) {
        yield [index++, light];
      }
    }
  }

  #getControllerById(
    controllerID: string,
  ): OctoController | GledoptoController | void {
    return (
      this.#octoControllers.get(controllerID) ??
      this.#gledOptoControllers.get(controllerID)
    );
  }

  async enableSacnOutput(controllerID: string): Promise<void> {
    const controller = this.#getControllerById(controllerID);
    await controller?.setupSacnSenders();
  }

  disableSacnOutput(controllerID: string): void {
    const controller = this.#getControllerById(controllerID);
    controller?.stopSacnSenders();
  }

  turnAllOff(controllerID: string | null = null): void {
    for (const [_, light] of this.getLightsIterator(controllerID)) {
      light.turnOff();
    }
  }

  turnAllOn(controllerID: string | null = null): void {
    for (const [_, light] of this.getLightsIterator(controllerID)) {
      light.turnOn();
    }
  }

  async startQLabReceiver(
    messageHandler: MessageHandler,
    broadcaster: Broadcaster,
  ): Promise<void> {
    await this.#qlabReceiver.start(messageHandler, broadcaster);
  }

  stopQLabReceiver(): void {
    this.#qlabReceiver.stop();
  }

  toQLabReceiverStatus(): QLabReceiverStatus {
    return this.#qlabReceiver.status;
  }
}
