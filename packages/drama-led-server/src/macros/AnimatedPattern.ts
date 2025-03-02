import { StartAnimatedPattern } from '@spencer516/drama-led-messages/src/macros/StartAnimatedPattern';
import ContinuousMacro from './ContinuousMacro';
import { IndexedColors, makeIndexedColors } from './utils/pattern-utils';
import { scaleLinear, ScaleLinear } from 'd3-scale';

type CustomParams = {
  indexedColors: IndexedColors;
  speedScale: ScaleLinear<number, number>;
};

export default class AnimatedPattern extends ContinuousMacro<
  StartAnimatedPattern['data'],
  CustomParams
> {
  getCustomParams(): CustomParams {
    return {
      indexedColors: makeIndexedColors(this.data.pattern),
      speedScale: scaleLinear()
        .range([0, this.data.speed]) // output (lights/second)
        .domain([0, 1000]), // input (timeElapse)
    };
  }

  tick(
    timeElapsed: number,
    _: number,
    { indexedColors, speedScale }: CustomParams,
  ) {
    const combinedLength = indexedColors.length;
    const offset = speedScale(timeElapsed);

    for (const [index, light] of this.lightsIterator({
      seriesDirection: this.data.seriesDirection,
      resetIndex: true,
    })) {
      const patternOffset = (index + offset) % combinedLength;
      const color = indexedColors.at(patternOffset);

      if (color != null) {
        light.setColor(color);
      }
    }
  }
}
