import { StartMovingShimmer } from '@spencer516/drama-led-messages/src/macros/StartMovingShimmer';
import SingleShotMacro from './SingleShotMacro';
import { scaleLinear, ScaleLinear, scalePow, ScalePower } from 'd3-scale';

type CustomParams = {
  animationScale: ScaleLinear<number, number>;
  spreadScale: ScalePower<number, number>;
  decayScale: ScaleLinear<number, number>;
};

export default class MovingShimmer extends SingleShotMacro<
  StartMovingShimmer['data'],
  CustomParams
> {
  getRange() {
    let bottom = Infinity;
    let top = -1 * Infinity;

    for (const [, { coordinates }] of this.lightsIterator()) {
      bottom = Math.min(coordinates.y, bottom);
      top = Math.max(coordinates.y, top);
    }

    const spread = this.data.spread;

    // Add extra space for the spread.
    bottom = bottom - spread;
    top = top + spread;

    return this.data.direction === 'UP' ? [bottom, top] : [top, bottom];
  }

  getCustomParams(): CustomParams {
    return {
      animationScale: scaleLinear().domain([0, 1]).range(this.getRange()),
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
    const verticalPosition = params.animationScale(percentComplete);
    const decayedDensity = params.decayScale(percentComplete);

    for (const [, light] of this.lightsIterator()) {
      const distanceFromVertical = Math.abs(
        light.coordinates.y - verticalPosition,
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
