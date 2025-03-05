import { StartRandomSparkle } from '@spencer516/drama-led-messages';
import SingleShotMacro from './SingleShotMacro';

type CustomParams = {};

export default class RandomSparkle extends SingleShotMacro<
  StartRandomSparkle['data'],
  CustomParams
> {
  getCustomParams(): CustomParams {
    return {};
  }

  tick(_percentComplete: number) {
    for (const [, light] of this.lightsIterator()) {
      if (Math.random() > 0.8) {
        light.turnOn();
      } else {
        light.turnOff();
      }
    }
  }
}
