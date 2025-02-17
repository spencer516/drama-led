import Broadcaster from '../Broadcaster';

export default class MacroBase {
  #broadcaster: Broadcaster;

  constructor(broadcaster: Broadcaster) {
    this.#broadcaster = broadcaster;
  }

  start() {
    throw new Error('Not implemented');
  }

  stop() {
    throw new Error('Not implemented');
  }

  broadcast() {
    this.#broadcaster.broadcast();
  }
}
