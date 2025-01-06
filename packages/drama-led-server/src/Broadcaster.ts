import { WebSocketServer, WebSocket } from "ws";
import LightSequence from "./LightSequence";
import { range, startEventLoop } from "./utils";
import { OutputMessage } from "@spencer516/drama-led-messages/src/OutputMessage";
import {Sender} from 'sacn';

export default class Broadcaster {
  #wss: WebSocketServer;
  #latestMessage: OutputMessage;
  #lightSequence: LightSequence;
  #cancelEventLoop: (() => void) | null = null;
  #sacnSender: Sender;

  constructor(
    wss: WebSocketServer,
    lightSequence: LightSequence,
    sacnSender: Sender,
  ) {
    this.#wss = wss;
    this.#lightSequence = lightSequence;
    this.#latestMessage = this.getMessage();
    this.#sacnSender = sacnSender;
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

    const addresses = this.#lightSequence.toAddresses();
    const payload = addresses.reduce<{[channel: string]: number}>((acc, address) => {
      const [_universe, channel, channelValue] = address;
      acc[channel] = channelValue;
      return acc;
    }, {});

    this.#sacnSender.send({
      payload,
      sourceName: 'Drama LED Server',
      priority: 200,
    }).then(() => {
      console.log('Updated Pixels', payload);
    }).catch(err => {
      console.error('Error Sending SACN', err);
    });

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