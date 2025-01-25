import { createSocket, Socket } from 'dgram';
import {
  parseMessage
} from '@spencer516/drama-led-messages/src/InputMessage';
import MessageHandler from './MessageHandler';

type Props = {
  port: number;
  messageHandler: MessageHandler;
};

export default class QLabReceiver {
  #socket: Socket;
  #port: number;
  #messageHandler: MessageHandler;

  constructor({
    port,
    messageHandler
  }: Props) {
    this.#socket = createSocket('udp4');
    this.#port = port;
    this.#messageHandler = messageHandler;
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#socket.on('listening', () => {
        const address = this.#socket.address();
        console.log(`server listening ${address.address}:${address.port}`);
        resolve();
      });

      // Timeout and emit error if no start event
      this.#socket.on('error', (err) => {
        console.error('Error starting UDP socket', err);
        reject(err);
      });

      this.#socket.on('message', (msg, rinfo) => {
        this.handleMessage(msg);
      });

      this.#socket.bind(this.#port)
    });
  }

  stop() {
    console.log('Closing UDP socket');
    this.#socket.close();
  }

  handleMessage(message: Buffer<ArrayBufferLike>) {
    this.#messageHandler.onMessage(message.toString());
  }
}