import { StartMovingShimmer } from '@spencer516/drama-led-messages/src/macros/StartMovingShimmer';
import SingleShotMacro from './SingleShotMacro';
import { scaleLinear, ScaleLinear, scalePow, ScalePower } from 'd3-scale';

type CustomParams = {
  verticalAnimation: ScaleLinear<number, number>;
  spreadScale: ScalePower<number, number>;
  decayScale: ScaleLinear<number, number>;
  horizontalCenter: number;
};

export default class MovingShimmer extends SingleShotMacro<
  StartMovingShimmer['data'],
  CustomParams
> {
  getBoundingBox() {
    let bottom = Infinity;
    let top = -1 * Infinity;
    let left = Infinity;
    let right = -1 * Infinity;

    for (const [, light] of this.lightsIterator()) {
      const {
        coordinates: { x, y },
      } = light;

      bottom = Math.min(y, bottom);
      top = Math.max(y, top);
      left = Math.min(x, left);
      right = Math.max(x, right);
    }

    const extraBuffer = ((right - left) / 2) * (this.data.slopeEffect / 100);

    bottom = bottom;
    top = top + this.data.spread + extraBuffer;
    left = left;
    right = right;

    return { bottom, top, left, right };
  }

  getCustomParams(): CustomParams {
    const { bottom, top, left, right } = this.getBoundingBox();

    const range = this.data.direction === 'UP' ? [bottom, top] : [top, bottom];

    return {
      verticalAnimation: scaleLinear().domain([0, 1]).range(range),
      horizontalCenter: (left + right) / 2 + left,
      decayScale: scaleLinear()
        .domain([0, 1])
        .range([
          this.data.density,
          this.data.density * ((100 - this.data.decay) / 100),
        ]),
      spreadScale: scalePow()
        .domain([0, this.data.spread])
        .rangeRound([100, 0])
        .exponent(3)
        .clamp(true),
    };
  }

  tick(percentComplete: number, params: CustomParams) {
    const verticalPosition = params.verticalAnimation(percentComplete);
    const decayedDensity = params.decayScale(percentComplete);

    for (const [, light] of this.lightsIterator()) {
      const distanceFromCenter = Math.abs(
        light.coordinates.x - params.horizontalCenter,
      );

      // This is to create a upside-down V effect
      const offsetVerticalPosition =
        verticalPosition - distanceFromCenter * (this.data.slopeEffect / 100);

      const distanceFromVertical = Math.abs(
        light.coordinates.y - offsetVerticalPosition,
      );

      const percent = params.spreadScale(distanceFromVertical);
      const threshold = 1 - decayedDensity / 100;

      if (Math.random() >= threshold) {
        light.setColorString(`rgba(255,255,255,${percent / 100})`);
      } else {
        light.turnOff();
      }
    }
  }
}
