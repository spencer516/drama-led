import { scalePow, ScalePower, scaleSequential } from 'd3-scale';
import { interpolateSinebow } from 'd3-scale-chromatic';
import { color } from 'd3-color';
import ContinuousMacro from './ContinuousMacro';
import { StartBasicChase } from '@spencer516/drama-led-messages/src/macros/StartBasicChase';

type CustomParams = {
  scale: ScalePower<number, number>;
  colorScale: (num: number) => string;
};

export default class BasicChase extends ContinuousMacro<
  StartBasicChase['data'],
  CustomParams
> {
  getCustomParams(): CustomParams {
    const { spread, color } = this.data;

    return {
      scale: scalePow()
        .domain([0, spread ?? 10])
        .rangeRound([100, 0])
        .exponent(2)
        .clamp(true),
      colorScale:
        color === 'rainbow'
          ? scaleSequential(interpolateSinebow).domain([
              0,
              this.lightsCount - 1,
            ])
          : () => color ?? 'white',
    };
  }

  tick(_: number, frameNumber: number, { scale, colorScale }: CustomParams) {
    const gap = this.data.gap ?? 0;
    const direction = this.data.direction ?? 'forward';

    for (const [index, light] of this.lightsIterator()) {
      const adjustedIndex = Math.abs(
        direction === 'forward' ? index - frameNumber : index + frameNumber,
      );
      const remainder = adjustedIndex % gap;
      const deltaToNext = Math.min(remainder, gap - remainder);
      const percent = scale(deltaToNext);

      const baseColor = colorScale(index);
      const transformedColor =
        color(baseColor)?.copy({ opacity: percent / 100 }) ?? color('black');

      light.setColor(transformedColor);
    }
  }
}
