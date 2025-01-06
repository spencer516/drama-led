import { WebSocketServer, WebSocket } from "ws";
import LightSequence from "./LightSequence";
import { startEventLoop } from "./utils";
import { safeParseMessage, OutputMessage } from "@spencer516/drama-led-messages/src/OutputMessage";

export default class Broadcaster {
  #wss: WebSocketServer;
  #latestMessage: OutputMessage;
  #lightSequence: LightSequence;
  #cancelEventLoop: (() => void) | null = null;

  constructor(
    wss: WebSocketServer,
    lightSequence: LightSequence,
  ) {
    this.#wss = wss;
    this.#lightSequence = lightSequence;
    this.#latestMessage = this.getMessage();
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

  /**
   * Send a message to all clients about the update.
   */
  broadcast(): this {
    for (const client of this.#wss.clients) {
      this.broadcastClient(client);
    }

    return this;
  }

  /**
   * Send the latest update to a specific client
   */
  broadcastClient(client: WebSocket): this {
    client.send(JSON.stringify(this.#latestMessage));
    return this;
  }

  /**
   * Evaluate the lights and serialize it into a broadcast-able message
   */
  updateMessage(): this {
    this.#latestMessage = this.getMessage();
    return this;
  }

  getMessage(): OutputMessage {
    const lights = this.#lightSequence.toLightConfigs();
    return OutputMessage.parse({
      type: 'ALL_LIGHTS',
      data: {
        lights
      }
    });
  }
}