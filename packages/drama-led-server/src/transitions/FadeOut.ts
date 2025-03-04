import Light, { LightColor } from '../Light';
import TransitionBase, { TReturnInterpolate } from './TransitionBase';
import { interpolateRgb } from 'd3-interpolate';

type Params = {
  duration: number;
};

const BLACK = `rgb(0,0,0)`;

export default class FadeOut extends TransitionBase<Params> {
  interpolate(queuedColors: LightColor[], light: Light): TReturnInterpolate {
    const lastColor = queuedColors.at(-1);

    if (lastColor == null) {
      return BLACK;
    }

    return interpolateRgb(lastColor, BLACK)(this.percentComplete);
  }
}
