import Broadcaster from "../Broadcaster";
import Light from "../Light";

export default class MacroBase {
  #broadcaster: Broadcaster;

  constructor(
    broadcaster: Broadcaster,
  ) {
    this.#broadcaster = broadcaster;
  }

  start() {
    throw new Error('Not implemented');
  }

  stop() {
    throw new Error('Not implemented');
  }

  broadcast() {
    this.#broadcaster.updateMessage().broadcast();
  }
}