import { WebSocketServer } from "ws";
import Broadcaster from "./Broadcaster";
import LightSequence from "./LightSequence";
import { parseMessage, UpdateSingleLight } from "./InputMessage";
import Light from "./Light";
import { invariant } from "./utils";

export default class MessageHandler {
  #wss: WebSocketServer;
  #broadcaster: Broadcaster;
  #lightSequence: LightSequence;
  #linearSequence: Light[];

  constructor(
    wss: WebSocketServer,
    broadcaster: Broadcaster,
    lightSequence: LightSequence
  ) {
    this.#wss = wss;
    this.#broadcaster = broadcaster;
    this.#lightSequence = lightSequence;
    this.#linearSequence = lightSequence.toLinearSequence();
  }

  onMessage(data: string) {
    const message = parseMessage(data);

    switch (message.type) {
      case 'UPDATE_LIGHT_BY_SEQUENCE':
        this.updateSingleLight(message.data);
        break;
      case 'UPDATE_ALL_LIGHTS':
        // TODO!
        break;
    }
  }

  updateSingleLight({ sequenceNumber, channel }: UpdateSingleLight['data']): void {
    const light = this.#linearSequence[sequenceNumber];

    invariant(light != null, `Could not find light at sequenceNumber ${sequenceNumber}`);

    light.setValue([
      channel.red,
      channel.green,
      channel.blue,
    ]);

    this.#broadcaster.updateMessage().broadcast();
  }
}