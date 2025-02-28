import Animator from '../Animator';
import Light from '../Light';

export type TGetLightsIterator = () => Iterable<[number, Light]>;

export default class AnimationMacroBase {
  #id: string;
  animator: Animator;
  getLightsIterator: TGetLightsIterator;
  onComplete: (() => void) | null = null;

  constructor(
    id: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
  ) {
    this.animator = animator;
    this.#id = id;
    this.getLightsIterator = getLightsIterator;
  }

  get id() {
    return this.#id;
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
