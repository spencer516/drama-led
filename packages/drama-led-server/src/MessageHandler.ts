import { WebSocketServer } from "ws";
import Broadcaster from "./Broadcaster";
import { parseMessage, UpdateLightByID } from "@spencer516/drama-led-messages/src/InputMessage";
import Light from "./Light";
import MacroBase from "./macros/MacroBase";
import BasicChase from "./macros/BasicChase";
import LEDSystem from "./LEDSystem";

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

    switch (message.type) {
      case 'UPDATE_LIGHT_BY_ID':
        this.updateLightByID(message.data);
        break;
      case 'START_BASIC_CHASE':
        const chase = new BasicChase(this.#broadcaster, this.#ledSystem, {
          spread: 3,
          gap: 10,
          frequencyInSeconds: 30,
          direction: 'forward',
          color: 'rainbow',
        });
        this.#currentMacro = chase;
        chase.start();
        break;
      case 'UPDATE_ALL_LIGHTS':
        // TODO
        break;
    }
  }

  updateLightByID({ id, rgb }: UpdateLightByID['data']): void {
    const light = Light.getLightByID(id);

    light.setRGB(rgb);

    this.#broadcaster.broadcast();
  }
}