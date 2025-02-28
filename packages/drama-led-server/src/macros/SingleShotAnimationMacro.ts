import Animator from '../Animator';
import AnimationMacroBase, { TGetLightsIterator } from './AnimationMacroBase';

type Params = {
  duration: number;
  maxFPS: number;
};

export default class SingleShotAnimationMacro extends AnimationMacroBase {
  #currentAnimation: (() => void) | null = null;
  duration: number;
  maxFPS: number;
  #hasRun: boolean = false;

  constructor(
    id: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
    { duration, maxFPS }: Params,
  ) {
    super(id, animator, getLightsIterator);
    this.duration = duration;
    this.maxFPS = maxFPS;
  }

  get isFinished() {
    return this.#hasRun && this.#currentAnimation == null;
  }

  startImpl() {
    this.#hasRun = true;

    if (this.#currentAnimation != null) {
      this.stop();
    }

    this.#currentAnimation = this.animator.animate(
      (percentComplete) => {
        this.tick(percentComplete);
      },
      {
        maxFPS: this.maxFPS,
        onComplete: () => this.stop(),
        durationInMs: this.duration,
      },
    );
  }

  stopImpl() {
    this.#currentAnimation?.();
    this.#currentAnimation = null;
  }

  tick(_percentComplete: number) {
    throw new Error('not implemented');
  }
}
