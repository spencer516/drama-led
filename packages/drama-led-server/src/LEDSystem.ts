import { LightConfig } from '@spencer516/drama-led-messages/src/AddressTypes';
import OctoController from './OctoController';
import Light, { LightBlendInterpolator } from './Light';
import {
  GledoptoControllerStatus,
  OctoControllerStatus,
  QLabReceiverStatus,
} from '@spencer516/drama-led-messages/src/OutputMessage';
import GledoptoController from './GledoptoController';
import QLabReceiver from './QLabReceiver';
import MessageHandler from './MessageHandler';
import Broadcaster from './Broadcaster';
import { NamedLEDSection } from '@spencer516/drama-led-messages/src/NamedLEDSection';
import { SeriesDirection } from '@spencer516/drama-led-messages/src/macros/utils/SeriesDirection';

export const SACN_NETWORK_INTERFACE = '192.168.1.199';

type TNamedSegments = Record<
  NamedLEDSection,
  Set<OctoController | GledoptoController>
>;

export type SegmentIteratorOptions = {
  seriesDirection?: SeriesDirection;
  resetIndex?: boolean;
};

export default class LEDSystem {
  #octoControllers: Map<string, OctoController>;
  #gledOptoControllers: Map<string, GledoptoController>;
  #qlabReceiver: QLabReceiver;
  #namedSegments: TNamedSegments;

  constructor(
    qlabReceiver: QLabReceiver,
    octoControllers: OctoController[],
    gledOptoControllers: GledoptoController[],
    namedSegments: TNamedSegments,
  ) {
    this.#octoControllers = new Map();
    this.#gledOptoControllers = new Map();
    this.#qlabReceiver = qlabReceiver;
    this.#namedSegments = namedSegments;

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

  flushLightColors(): void {
    for (const [_, light] of this.getLightsIterator()) {
      light.flushQueuedColors();
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

  toGledOptoControllerStatus(): GledoptoControllerStatus[] {
    return Array.from(this.#gledOptoControllers.values()).map(
      (controller) => controller.status,
    );
  }

  get countLights(): number {
    const lightsArray = Array.from(this.getLightsIterator());
    return lightsArray.length;
  }

  getSegmentIterator(
    segmentName: NamedLEDSection,
  ): () => Generator<[number, Light]> {
    return () => this.iterateSegment(segmentName);
  }

  doSegmentsOverlap(
    segmentA: NamedLEDSection,
    segmentB: NamedLEDSection,
  ): boolean {
    if (segmentA === segmentB) {
      return true;
    }

    const controllersA = this.#namedSegments[segmentA];
    const controllersB = this.#namedSegments[segmentB];

    for (const controllerA of controllersA) {
      if (controllersB.has(controllerA)) {
        return true;
      }
    }

    for (const controllerB of controllersB) {
      if (controllersA.has(controllerB)) {
        return true;
      }
    }

    return false;
  }

  *iterateSegment(
    segmentName: NamedLEDSection,
    segmentOptions: SegmentIteratorOptions = {},
  ): Generator<[number, Light]> {
    const { seriesDirection = 'left-to-right', resetIndex = false } =
      segmentOptions;

    let index = 0;
    for (const controller of this.#namedSegments[segmentName]) {
      if (resetIndex) {
        index = 0;
      }

      const lightsArray = controller.lights;
      const lightsLength = lightsArray.length;
      const middleLight = Math.round(lightsLength / 2);

      switch (seriesDirection) {
        case 'right-to-left':
          for (const light of controller.lights) {
            yield [index++, light];
          }
          break;
        case 'left-to-right':
          for (
            let innerIndex = lightsLength - 1;
            innerIndex >= 0;
            innerIndex--
          ) {
            yield [index++, lightsArray[innerIndex]];
          }
          break;
        case 'bottom-to-top':
          // Go to the right first:
          // Middle Light => End
          for (
            let innerIndex = middleLight;
            innerIndex < lightsLength;
            innerIndex++
          ) {
            yield [index++, lightsArray[innerIndex]];
          }

          // Then to the left
          // Middle Light => 0
          for (
            let innerIndex = middleLight - 1;
            innerIndex >= 0;
            innerIndex--
          ) {
            yield [index++, lightsArray[innerIndex]];
          }
          break;
        case 'top-to-bottom':
          // Go Up the left side first:
          // 0 => Middle Light
          for (let innerIndex = 0; innerIndex <= middleLight; innerIndex++) {
            yield [index++, lightsArray[innerIndex]];
          }

          // Go Up the right side
          // End => Middle Light
          for (
            let innerIndex = lightsLength - 1;
            innerIndex > middleLight;
            innerIndex--
          ) {
            yield [index++, lightsArray[innerIndex]];
          }

          break;
      }
    }
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

  async enableSacnOutput(
    controllerID: string,
    broadcaster: Broadcaster,
  ): Promise<void> {
    const controller = this.#getControllerById(controllerID);
    await controller?.setupSacnSenders(broadcaster);
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
