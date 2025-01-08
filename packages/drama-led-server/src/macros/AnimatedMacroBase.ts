import Broadcaster from "../Broadcaster";
import MacroBase from "./MacroBase";

export default class AnimatedMacroBase extends MacroBase {
  #intervalConfig: {
    startTime: number,
    timeout: NodeJS.Timeout | null,
  };

  #fps: number = 60;

  constructor(
    broadcaster: Broadcaster,
  ) {
    super(broadcaster);
    this.#intervalConfig = {
      startTime: 0,
      timeout: null,
    }
  }

  setFPS(fps: number) {
    this.#fps = fps;
  }

  start() {
    const interval = setInterval(() => {
      this.tick();
    }, 1000 / this.#fps);

    this.#intervalConfig = {
      startTime: performance.now(),
      timeout: interval,
    };

    this.tick();
  }

  stop() {
    if (this.#intervalConfig.timeout != null) {
      clearInterval(this.#intervalConfig.timeout);
    }

    this.onStop();
  }

  get msSinceStart() {
    return performance.now() - this.#intervalConfig.startTime;
  }

  onStop() {
    throw new Error('Not implemented');
  }

  tick() {
    throw new Error('Not implemented');
  }
}