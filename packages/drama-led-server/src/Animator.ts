import { EventEmitter } from 'stream';
import { interval, now, Timer } from 'd3-timer';
import { clamp } from './utils';

export const ONE_SECOND = 1000;

type AnimateParams = {
  durationInMs: number;
  onComplete: (() => void) | undefined;
};

type TickCallback = () => void;

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
        this.emit('afterTick');
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

  off(eventName: string | symbol, listener: (...args: any[]) => void) {
    super.off(eventName, listener);
    this.stopIfNoListeners();

    return this;
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void) {
    super.on(eventName, listener);
    return this;
  }

  stopIfNoListeners() {
    if (this.listenerCount('tick') === 0) {
      this.stop();
    }
  }

  loop(tickCallback: (timeElapsed: number) => void): () => void {
    this.startIfNotRunning();

    let start: number | null = null;

    const callback = (currentTime: number) => {
      if (start == null) {
        start = currentTime;
      }

      const timeElapsed = currentTime - start;
      tickCallback(timeElapsed);
    };

    this.on('tick', callback);

    return () => this.off('tick', callback);
  }

  animate(
    frameCallback: (pct: number) => void,
    { durationInMs, onComplete }: AnimateParams,
  ): () => void {
    this.startIfNotRunning();

    let start: number | null = null;

    const callback = (currentTime: number) => {
      if (start == null) {
        start = currentTime;
      }

      const percentComplete = clamp({
        value: durationInMs === 0 ? 1 : (currentTime - start) / durationInMs,
        min: 0,
        max: 1,
      });

      frameCallback(percentComplete);

      if (percentComplete >= 1) {
        this.off('tick', callback);
        onComplete?.();
      }
    };

    this.on('tick', callback);

    return () => this.off('tick', callback);
  }
}
