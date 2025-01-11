import {WebSocketServer, WebSocket} from 'ws';
import {startEventLoop} from './utils';
import {OutputMessage} from '@spencer516/drama-led-messages/src/OutputMessage';
import LEDSystem from './LEDSystem';

export default class Broadcaster {
  #wss: WebSocketServer;
  #ledSystem: LEDSystem;
  #cancelEventLoop: (() => void) | null = null;

  constructor(
    wss: WebSocketServer,
    lightSequence: LEDSystem,
  ) {
    this.#wss = wss;
    this.#ledSystem = lightSequence;
  }

  /**
   * Start loop
   */
  startBroadcastLoop(frequency: number): this {
    if (this.#cancelEventLoop !== null) {
      this.#cancelEventLoop();
    }

    this.#cancelEventLoop = startEventLoop(
      () => this.broadcast(),
      frequency,
    );

    return this;
  }

  /**
   * Cancel Loop
   */
  cancelBroadcastLoop(): this {
    this.#cancelEventLoop?.();
    return this;
  }

  /**
   * Send a message to all clients about the update.
   */
  broadcast(client?: WebSocket): this {
    const lights = this.#ledSystem.toLightConfigs();
    const message = OutputMessage.parse({
      type: 'ALL_LIGHTS',
      data: {
        lights,
      },
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
