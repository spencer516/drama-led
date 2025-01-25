import {WebSocketServer} from 'ws';
import Broadcaster from './Broadcaster';
import {
  parseMessage,
  UpdateLightByID,
} from '@spencer516/drama-led-messages/src/InputMessage';
import Light from './Light';
import MacroBase from './macros/MacroBase';
import BasicChase from './macros/BasicChase';
import LEDSystem from './LEDSystem';
import RadialChase from './macros/RadialChase';
import RandomSparkle from './macros/RandomSparkle';

export default class MessageHandler {
  #wss: WebSocketServer;
  #broadcaster: Broadcaster;
  #ledSystem: LEDSystem;
  #currentMacro: MacroBase | null = null;

  constructor(
    wss: WebSocketServer,
    broadcaster: Broadcaster,
    ledSystem: LEDSystem,
  ) {
    this.#wss = wss;
    this.#broadcaster = broadcaster;
    this.#ledSystem = ledSystem;
  }

  onMessage(data: string) {
    const message = parseMessage(data);

    this.#currentMacro?.stop();

    console.log('Received message:', message.type);

    switch (message.type) {
      case 'UPDATE_LIGHT_BY_ID':
        this.updateLightByID(message.data);
        break;
      case 'START_BASIC_CHASE':
        this.#currentMacro = new BasicChase(
          this.#broadcaster,
          this.#ledSystem,
          message.data,
        );
        this.#currentMacro.start();
        break;
      case 'START_RADIAL_CHASE':
        this.#currentMacro = new RadialChase(
          this.#broadcaster,
          this.#ledSystem,
        );
        this.#currentMacro.start();
        break;
      case 'START_RANDOM_SPARKLE':
        this.#currentMacro = new RandomSparkle(
          this.#broadcaster,
          this.#ledSystem,
        );
        this.#currentMacro.start();
        break;
      case 'TURN_ALL_OFF':
        this.#ledSystem.turnAllOff();
        this.#broadcaster.broadcast();
        break;
      case 'TURN_ALL_ON':
        this.#ledSystem.turnAllOn();
        this.#broadcaster.broadcast();
        break;
      case 'UPDATE_ALL_LIGHTS':
        // TODO
        break;
    }
  }

  updateLightByID({
    id,
    rgb,
  }: UpdateLightByID['data']): void {
    const light = Light.getLightByID(id);

    light.setRGB(rgb);

    this.#broadcaster.broadcast();
  }
}
