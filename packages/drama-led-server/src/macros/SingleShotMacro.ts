import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';
import MacroBase from './MacroBase';

export type MinimumDataType = {
  maxFPS?: number;
  duration: number;
  [key: string]: unknown;
};

type CustomParams = {
  [key: string]: unknown;
};

export default class SingleShotMacro<
  TMessageData extends MinimumDataType,
  TCustomParams extends CustomParams,
> extends MacroBase<TMessageData> {
  #currentAnimation: (() => void) | null = null;
  #hasRun: boolean = false;
  #percentComplete: number = 0;

  startImpl() {
    this.#hasRun = true;

    if (this.#currentAnimation != null) {
      this.stop();
    }

    this.#currentAnimation = this.animator.animate(
      (percentComplete) => {
        this.#percentComplete = percentComplete;
        this.tick(percentComplete);
      },
      {
        maxFPS: this.data.maxFPS ?? 60,
        onComplete: () => this.stop(),
        durationInMs: this.data.duration,
      },
    );
  }

  getMacroStatus(): MacroStatus {
    const parent = super.getMacroStatus();

    return {
      ...parent,
      percentComplete: this.#percentComplete,
    };
  }

  getCustomParams(): TCustomParams {
    throw new Error('Not Implemented');
  }

  get isFinished() {
    return this.#hasRun && this.#currentAnimation == null;
  }

  stopImpl() {
    this.#currentAnimation?.();
    this.#currentAnimation = null;
  }

  tick(_percentComplete: number) {
    throw new Error('not implemented');
  }
}
