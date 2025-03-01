import Animator from '../Animator';
import Light from '../Light';

export type TGetLightsIterator = () => Iterable<[number, Light]>;

export default class AnimationMacroBase {
  #cueID: string;
  animator: Animator;
  getLightsIterator: TGetLightsIterator;
  onComplete: (() => void) | null = null;

  constructor(
    cueID: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
  ) {
    this.animator = animator;
    this.#cueID = cueID;
    this.getLightsIterator = getLightsIterator;
  }

  get cueID() {
    return this.#cueID;
  }

  get isFinished(): boolean {
    throw new Error('Not implemented');
  }

  start(onComplete: () => void) {
    this.onComplete = onComplete;
    this.startImpl();
  }

  startImpl() {
    throw new Error('Not implemented');
  }

  stop() {
    this.stopImpl();
    this.onComplete?.();

    for (const [, light] of this.getLightsIterator()) {
      light.turnOff();
    }
  }

  stopImpl() {
    throw new Error('Not implemented');
  }
}
