import { LightConfig } from '@spencer516/drama-led-messages/src/AddressTypes';
import OctoController from './OctoController';
import Light from './Light';
import { OctoControllerStatus } from '@spencer516/drama-led-messages/src/OutputMessage';

export default class LEDSystem {
  #octoControllers: Map<string, OctoController>;

  constructor(octoControllers: OctoController[]) {
    const controllers = new Map();

    for (const octoController of octoControllers) {
      controllers.set(octoController.id, octoController);
    }

    this.#octoControllers = controllers;
  }

  broadcast(): void {
    for (const controller of this.#octoControllers.values()) {
      controller.broadcast();
    }
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
  }

  async enableSacnOutput(controllerID: string): Promise<void> {
    const controller = this.#octoControllers.get(controllerID);
    await controller?.setupSacnSenders();
  }

  disableSacnOutput(controllerID: string): void {
    const controller = this.#octoControllers.get(controllerID);
    controller?.stopSacnSenders();
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
