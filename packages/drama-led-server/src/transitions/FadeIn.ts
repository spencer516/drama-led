import Light, { LightColor } from '../Light';
import TransitionBase, { TReturnInterpolate } from './TransitionBase';
import { interpolateRgb } from 'd3-interpolate';

type Params = {
  duration: number;
};

const BLACK = `rgb(0,0,0)`;

export default class FadeIn extends TransitionBase<Params> {
  interpolate(queuedColors: LightColor[], _light: Light): TReturnInterpolate {
    const lastColor = queuedColors.at(-1);
    const secondToLastColor = queuedColors.at(-2);

    if (lastColor == null) {
      return BLACK;
    }

    return interpolateRgb(
      secondToLastColor ?? BLACK,
      lastColor,
    )(this.percentComplete);
  }
}
