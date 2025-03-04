import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';
import MacroBase from './MacroBase';

export type MinimumDataType = {
  duration: number;
  [key: string]: unknown;
};

type CustomParams = {
  [key: string]: unknown;
};

export default abstract class SingleShotMacro<
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

    const params = this.getCustomParams();

    this.#currentAnimation = this.animator.animate(
      (percentComplete) => {
        this.#percentComplete = percentComplete;

        for (const [, light] of this.lightsIterator()) {
          light.setTransition(this.currentTransition);
        }

        this.tick(percentComplete, params);
      },
      {
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

  abstract getCustomParams(): TCustomParams;

  get isFinished() {
    return this.#hasRun && this.#currentAnimation == null;
  }

  stopImpl() {
    this.#currentAnimation?.();
    this.#currentAnimation = null;
  }

  abstract tick(_percentComplete: number, _params: TCustomParams): void;
}
