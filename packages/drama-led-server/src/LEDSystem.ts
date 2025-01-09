import { LightConfig, Universe } from "@spencer516/drama-led-messages/src/AddressTypes";
import OctoController from "./OctoController";
import Light from "./Light";

export default class LEDSystem {
  #octoControllers: Map<string, OctoController>;
  #controllersByUniverse: Map<Universe, OctoController>;

  constructor(octoControllers: OctoController[]) {
    const controllers = new Map();
    const controllersByUniverse = new Map();

    for (const octoController of octoControllers) {
      controllers.set(octoController.id, octoController);

      for (const universe of octoController.universes) {
        controllersByUniverse.set(universe, octoController);
      }
    }

    this.#octoControllers = controllers;
    this.#controllersByUniverse = controllersByUniverse;
  }

  broadcast(): void {
    for (const controller of this.#octoControllers.values()) {
      controller.broadcast();
    }
  }

  toLightConfigs(): LightConfig[] {
    return Array.from(this.#octoControllers.values())
      .flatMap((controller) => controller.toLightConfigs());
  }

  toLinearSequence(): Light[] {
    return Array.from(this.#octoControllers.values())
      .flatMap((controller) => controller.lights);
  }

  enableSacnOutput(): void {
    for (const controller of this.#octoControllers.values()) {
      controller.setupSacnSenders();
    }
  }
}