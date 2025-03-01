import { WebSocketServer, WebSocket } from 'ws';
import { startEventLoop } from './utils';
import { OutputMessage } from '@spencer516/drama-led-messages/src/OutputMessage';
import LEDSystem from './LEDSystem';
import MacroCoordinator from './macros/MacroCoordinator';

export default class Broadcaster {
  #wss: WebSocketServer;
  #ledSystem: LEDSystem;
  #cancelEventLoop: (() => void) | null = null;
  #macroCoordinator: MacroCoordinator | null = null;

  constructor(wss: WebSocketServer, lightSequence: LEDSystem) {
    this.#wss = wss;
    this.#ledSystem = lightSequence;
  }

  set macroCoordinator(coordinator: MacroCoordinator) {
    this.#macroCoordinator = coordinator;
  }

  /**
   * Start loop
   */
  startBroadcastLoop(frequency: number): this {
    if (this.#cancelEventLoop !== null) {
      this.#cancelEventLoop();
    }

    this.#cancelEventLoop = startEventLoop(() => this.broadcast(), frequency);

    return this;
  }

  /**
   * Cancel Loop
   */
  cancelBroadcastLoop(): this {
    this.#cancelEventLoop?.();
    return this;
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

  /**
   * Send a message to all clients about the update.
   */
  broadcast(client?: WebSocket): this {
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

    if (client != null) {
      client.send(stringifiedMessage);
    } else {
      for (const client of this.#wss.clients) {
        client.send(stringifiedMessage);
      }
    }

    this.#ledSystem.broadcast();

    return this;
  }
}
