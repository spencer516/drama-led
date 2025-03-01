import { StartShimmerAnimation } from '@spencer516/drama-led-messages/src/macros/StartShimmerAnimation';
import ContinuousMacro from './ContinuousMacro';

type CustomParams = {};

export default class ShimmerAnimation extends ContinuousMacro<
  StartShimmerAnimation['data'],
  CustomParams
> {
  getCustomParams(): CustomParams {
    return {};
  }

  tick(_timeElapsed: number, frameNumber: number) {
    const interval = Math.floor(100 / this.data.speed);

    if (frameNumber % interval !== 0) {
      return;
    }

    const threshold = 1 - this.data.density / 100;

    for (const [, light] of this.lightsIterator()) {
      if (Math.random() >= threshold) {
        light.setRGB(this.data.color);
      } else {
        light.turnOff();
      }
    }
  }
}
