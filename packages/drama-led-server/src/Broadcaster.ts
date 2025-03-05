import { WebSocketServer, WebSocket } from 'ws';
import { OutputMessage } from '@spencer516/drama-led-messages';
import LEDSystem from './LEDSystem';
import MacroCoordinator from './macros/MacroCoordinator';

export default class Broadcaster {
  #wss: WebSocketServer;
  #ledSystem: LEDSystem;
  #macroCoordinator: MacroCoordinator | null = null;

  constructor(wss: WebSocketServer, lightSequence: LEDSystem) {
    this.#wss = wss;
    this.#ledSystem = lightSequence;
  }

  set macroCoordinator(coordinator: MacroCoordinator) {
    this.#macroCoordinator = coordinator;
  }

  broadcastGledoptosStatus(): this {
    const stringifiedMessage = JSON.stringify({
      gledoptos: this.#ledSystem.toGledOptoControllerStatus(),
    });

    for (const client of this.#wss.clients) {
      client.send(stringifiedMessage);
    }

    return this;
  }

  broadcastQLabStatus(): this {
    const stringifiedMessage = JSON.stringify({
      qlabStatus: this.#ledSystem.toQLabReceiverStatus(),
    });

    for (const client of this.#wss.clients) {
      client.send(stringifiedMessage);
    }

    return this;
  }

  flushLightsWithDefaultAndBroadcast() {
    this.#ledSystem.flushLightColors();
    this.broadcast();
  }

  broadcastToWebClients() {
    const lights = this.#ledSystem.toLightConfigs();
    const octos = this.#ledSystem.toOctoControllerStatus();
    const gledoptos = this.#ledSystem.toGledOptoControllerStatus();

    const message = OutputMessage.parse({
      lights,
      octos,
      gledoptos,
      mainServer: {
        sacnIPAddress: this.#ledSystem.getNetworkInterface(),
      },
      qlabStatus: this.#ledSystem.toQLabReceiverStatus(),
      activeMacros: this.#macroCoordinator?.toMacroStatus() ?? [],
    });

    const stringifiedMessage = JSON.stringify(message);

    for (const client of this.#wss.clients) {
      client.send(stringifiedMessage);
    }
  }

  /**
   * Send a message to all clients about the update.
   */
  broadcast(): this {
    this.broadcastToWebClients();
    this.#ledSystem.broadcast();

    return this;
  }
}
