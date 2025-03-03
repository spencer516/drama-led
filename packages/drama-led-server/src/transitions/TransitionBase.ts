import Animator from '../Animator';
import { LightBlendInterpolator } from '../Light';

type MinimumParams = {
  duration: number;
};

export type TReturnInterpolate = ReturnType<LightBlendInterpolator>;

export default abstract class TransitionBase<TParams extends MinimumParams> {
  percentComplete: number = 0;
  animator: Animator;
  params: TParams;

  #currentAnimation: (() => void) | null = null;

  constructor(animator: Animator, params: TParams) {
    this.animator = animator;
    this.params = params;
  }

  start(onComplete: () => void) {
    if (this.#currentAnimation != null) {
      this.stop();
    }

    this.percentComplete = 0;

    this.#currentAnimation = this.animator.animate(
      (percentComplete) => {
        this.percentComplete = percentComplete;
      },
      {
        onComplete,
        durationInMs: this.params.duration,
      },
    );
  }

  stop() {
    this.#currentAnimation?.();
    this.#currentAnimation = null;
  }

  getInterpolator() {
    return (...args: Parameters<LightBlendInterpolator>) =>
      this.interpolate(...args);
  }

  abstract interpolate(
    ...args: Parameters<LightBlendInterpolator>
  ): TReturnInterpolate;
}
