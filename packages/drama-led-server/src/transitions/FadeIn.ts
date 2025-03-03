import { rgb } from 'd3-color';
import { LightColor } from '../Light';
import TransitionBase, { TReturnInterpolate } from './TransitionBase';
import { interpolateRgb } from 'd3-interpolate';

type Params = {
  duration: number;
};

const BLACK = `rgb(0,0,0)`;

export default class FadeIn extends TransitionBase<Params> {
  interpolate(queuedColors: LightColor[]): TReturnInterpolate {
    // Since we're just fading IN, it's always from black.
    const lastColor = queuedColors.at(-1);

    if (lastColor == null) {
      return BLACK;
    }

    return interpolateRgb(BLACK, lastColor)(this.percentComplete);
  }
}
