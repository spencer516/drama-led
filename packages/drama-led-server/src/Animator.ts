import { EventEmitter } from 'stream';
import { interval, now, Timer } from 'd3-timer';
import { clamp } from './utils';

export const ONE_SECOND = 1000;

// EXAMPLE USAGE!!
// const animator = new Animator();
// animator.animate((pct) => console.log(`#1: ${pct}`), ONE_SECOND * 5);
// animator.animate((pct) => console.log(`#2: ${pct}`), ONE_SECOND * 2);
// animator.loop((time) => console.log(`time elapsed ${time}`), 2);
// animationLoop.start();
// setTimeout(() => animator.stop(), 3000);

export default class Animator extends EventEmitter {
  #fps: number = 30;
  #currentTimer: Timer | null = null;

  start() {
    if (this.#currentTimer != null) {
      throw new Error('Could not start a timer; one already exists');
    }

    this.#currentTimer = interval(
      (currentTime) => {
        this.emit('tick', currentTime);
      },
      ONE_SECOND / this.#fps,
      now(),
    );
  }

  stop() {
    this.#currentTimer?.stop();
    this.#currentTimer = null;
    this.removeAllListeners('tick');
  }

  get isRunning() {
    return this.#currentTimer !== null;
  }

  startIfNotRunning() {
    if (!this.isRunning) {
      this.start();
    }
  }

  stopIfNoListeners() {
    if (this.listenerCount('tick') === 0) {
      this.stop();
    }
  }

  loop(
    tickCallback: (timeElapsed: number) => void,
    maxFPS: number,
  ): () => void {
    this.startIfNotRunning();

    let start: number | null = null;
    let lastFrameTime: number | null = null;

    const callback = (currentTime: number) => {
      if (start == null) {
        start = currentTime;
      }

      if (lastFrameTime == null) {
        lastFrameTime = currentTime;
        tickCallback(0);
        return;
      }

      if (currentTime - lastFrameTime > ONE_SECOND / maxFPS) {
        const timeElapsed = currentTime - start;
        tickCallback(timeElapsed);
        lastFrameTime = currentTime;
      }
    };

    this.on('tick', callback);

    return () => this.off('tick', callback);
  }

  animate(frameCallback: (pct: number) => void, durationInMs: number) {
    this.startIfNotRunning();

    let start: number | null = null;

    const callback = (currentTime: number) => {
      if (start == null) {
        start = currentTime;
      }

      const percentComplete = clamp({
        value: (currentTime - start) / durationInMs,
        min: 0,
        max: 1,
      });

      frameCallback(percentComplete);

      if (percentComplete >= 1) {
        this.off('tick', callback);
      }
    };

    this.on('tick', callback);
  }
}
