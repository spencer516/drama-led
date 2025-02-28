import Animator from '../Animator';
import { TGetLightsIterator } from './AnimationMacroBase';
import SingleShotAnimationMacro from './SingleShotAnimationMacro';

export default class RandomSparkle extends SingleShotAnimationMacro {
  constructor(
    id: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
  ) {
    super(id, animator, getLightsIterator, {
      duration: 1000 * 2,
      maxFPS: 5,
    });
  }

  tick(_percentComplete: number) {
    for (const [, light] of this.getLightsIterator()) {
      if (Math.random() > 0.8) {
        light.turnOn();
      } else {
        light.turnOff();
      }
    }
  }
}
