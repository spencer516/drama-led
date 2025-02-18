import { LightConfig } from '@spencer516/drama-led-messages/src/AddressTypes';
import OctoController from './OctoController';
import Light from './Light';
import {
  GledoptoControllerStatus,
  OctoControllerStatus,
} from '@spencer516/drama-led-messages/src/OutputMessage';
import GledoptoController from './GledoptoController';

export const SACN_NETWORK_INTERFACE = '192.168.1.199';

export default class LEDSystem {
  #octoControllers: Map<string, OctoController>;
  #gledOptoControllers: Map<string, GledoptoController>;

  constructor(
    octoControllers: OctoController[],
    gledOptoControllers: GledoptoController[],
  ) {
    this.#octoControllers = new Map();
    this.#gledOptoControllers = new Map();

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

  *getLightsIterator(): Generator<[number, Light]> {
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
  }

  async enableSacnOutput(controllerID: string): Promise<void> {
    const controller = this.#octoControllers.get(controllerID);
    await controller?.setupSacnSenders();

    const gledOptoController = this.#gledOptoControllers.get(controllerID);
    await gledOptoController?.setupSacnSender();
  }

  disableSacnOutput(controllerID: string): void {
    const controller = this.#octoControllers.get(controllerID);
    controller?.stopSacnSenders();

    const gledOptoController = this.#gledOptoControllers.get(controllerID);
    gledOptoController?.stopSacnSender();
  }

  turnAllOff(): void {
    for (const [_, light] of this.getLightsIterator()) {
      light.turnOff();
    }
  }

  turnAllOn(): void {
    for (const [_, light] of this.getLightsIterator()) {
      light.turnOn();
    }
  }
}
