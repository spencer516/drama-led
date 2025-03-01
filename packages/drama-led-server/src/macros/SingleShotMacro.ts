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

  startImpl() {
    this.#hasRun = true;

    if (this.#currentAnimation != null) {
      this.stop();
    }

    console.log('STARTING!!', this.type);

    this.#currentAnimation = this.animator.animate(
      (percentComplete) => {
        this.tick(percentComplete);
      },
      {
        maxFPS: this.data.maxFPS ?? 60,
        onComplete: () => this.stop(),
        durationInMs: this.data.duration,
      },
    );
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
