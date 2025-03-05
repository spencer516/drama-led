import { createSocket, Socket } from 'dgram';
import MessageHandler from './MessageHandler';
import {
  QLabReceiverConnectionStatus,
  QLabReceiverStatus,
} from '@spencer516/drama-led-messages';
import Broadcaster from './Broadcaster';

type Props = {
  port: number;
};

export default class QLabReceiver {
  #socket: Socket | null = null;
  #port: number;
  #status: QLabReceiverConnectionStatus = 'stopped';
  #connectionError: string | null = null;

  constructor({ port }: Props) {
    this.#port = port;
  }

  async start(
    messageHandler: MessageHandler,
    broadcaster: Broadcaster,
  ): Promise<void> {
    if (this.#socket != null) {
      return;
    }

    try {
      this.#status = 'starting';
      broadcaster.broadcastQLabStatus();
      await this.#startImpl(messageHandler);
      this.#status = 'listening';
    } catch (err: unknown) {
      this.#connectionError = String(err);
      this.#status = 'stopped';
    }
  }

  #startImpl(messageHandler: MessageHandler): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = (this.#socket = createSocket('udp4'));

      socket.on('listening', resolve);
      socket.on('error', reject);

      socket.on('message', (msg) => {
        messageHandler.onMessage(msg.toString());
      });

      socket.bind(this.#port);
    });
  }

  stop() {
    this.#socket?.close();
    this.#socket = null;
    this.#status = 'stopped';
  }

  get status(): QLabReceiverStatus {
    return {
      port: this.#port,
      status: this.#status,
      connectionError: this.#connectionError,
    };
  }
}
