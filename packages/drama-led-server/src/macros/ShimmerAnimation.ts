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

  tick(timeElapsed: number) {
    const frameNumber = Math.floor(timeElapsed / 30);
    const interval = Math.floor(100 / this.data.speed);
    const isSkippedFrame = frameNumber % interval !== 0;

    const threshold = 1 - this.data.density / 100;

    for (const [, light] of this.lightsIterator()) {
      if (isSkippedFrame) {
        light.setColorToCurrent();
      } else if (Math.random() >= threshold) {
        light.setColorString(this.data.color);
      } else {
        light.turnOff();
      }
    }
  }
}
