import Animator from '../Animator';
import AnimationMacroBase, { TGetLightsIterator } from './AnimationMacroBase';

type Params = {
  maxFPS: number;
};

export default class LoopingAnimationMacro extends AnimationMacroBase {
  maxFPS: number;
  cancelAnimation: (() => void) | null = null;

  constructor(
    id: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
    { maxFPS }: Params,
  ) {
    super(id, animator, getLightsIterator);
    this.maxFPS = maxFPS;
  }

  startImpl() {
    if (this.cancelAnimation != null) {
      this.cancelAnimation();
    }

    this.cancelAnimation = this.animator.loop((timeElapsed, frameNumber) => {
      this.tick(timeElapsed, frameNumber);
    }, this.maxFPS);
  }

  stopImpl() {
    this.cancelAnimation?.();
    this.cancelAnimation = null;
  }

  tick(timeElapsed: number, frameNumber: number) {
    throw new Error('Not Implemented');
  }
}
