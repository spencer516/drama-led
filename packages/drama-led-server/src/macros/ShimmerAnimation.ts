import { RGBColor } from '@spencer516/drama-led-messages/src/RGBColor';
import Animator from '../Animator';
import LEDSystem from '../LEDSystem';
import { TGetLightsIterator } from './AnimationMacroBase';
import LoopingAnimationMacro from './LoopingAnimationMacro';
import { StartShimmerAnimation } from '@spencer516/drama-led-messages/src/macros/StartShimmerAnimation';

export default class ShimmerAnimation extends LoopingAnimationMacro {
  speed: number;
  density: number;
  color: RGBColor;

  constructor(
    id: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
    { speed, density, color }: StartShimmerAnimation['data'],
  ) {
    super(id, animator, getLightsIterator, { maxFPS: 60 });
    this.speed = speed;
    this.density = density;
    this.color = color;
  }

  static create(
    ledSystem: LEDSystem,
    animator: Animator,
    { cueID, segment, data }: StartShimmerAnimation,
  ): ShimmerAnimation {
    return new ShimmerAnimation(
      cueID,
      animator,
      ledSystem.getSegmentIterator(segment),
      data,
    );
  }

  tick(_timeElapsed: number, frameNumber: number) {
    const interval = Math.floor(100 / this.speed);

    if (frameNumber % interval !== 0) {
      return;
    }

    const threshold = 1 - this.density / 100;

    for (const [, light] of this.getLightsIterator()) {
      if (Math.random() >= threshold) {
        light.setRGB(this.color);
      } else {
        light.turnOff();
      }
    }
  }
}
