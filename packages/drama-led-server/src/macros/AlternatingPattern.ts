import { StartAlternatingPattern } from '@spencer516/drama-led-messages/src/macros/StartAlternatingPattern';
import ContinuousMacro from './ContinuousMacro';
import { IndexedColors, makeIndexedColors } from './utils/pattern-utils';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { SeriesDirection } from '@spencer516/drama-led-messages/src/macros/utils/SeriesDirection';

type SeriesDefinition = {
  indexedColors: IndexedColors;
  speedScale: ScaleLinear<number, number>;
  seriesDirection: SeriesDirection;
  duration: number;
};

type CustomParams = {
  seriesDefinitions: SeriesDefinition[];
  currentSeriesIndex: number;
  currentSeries: {
    seriesDefinition: SeriesDefinition;
    startTime: number;
    endTime: number;
  };
};

export default class AlternatingPattern extends ContinuousMacro<
  StartAlternatingPattern['data'],
  CustomParams
> {
  getCustomParams(): CustomParams {
    const seriesDefinitions = this.data.series.map(
      ({ pattern, speed, seriesDirection, duration }) => ({
        indexedColors: makeIndexedColors(pattern),
        speedScale: scaleLinear().range([0, speed]).domain([0, 1000]),
        seriesDirection,
        duration,
      }),
    );

    const firstSeries = seriesDefinitions.at(0)!;

    return {
      seriesDefinitions,
      currentSeriesIndex: 0,
      currentSeries: {
        startTime: 0,
        endTime: firstSeries.duration,
        seriesDefinition: firstSeries,
      },
    };
  }

  tick(timeElapsed: number, customParams: CustomParams) {
    const { seriesDefinitions, currentSeries, currentSeriesIndex } =
      customParams;
    const { endTime } = currentSeries;

    if (timeElapsed >= endTime) {
      const nextSeriesIndex =
        (currentSeriesIndex + 1) % seriesDefinitions.length;
      const nextSeriesDefinition = seriesDefinitions[nextSeriesIndex];
      const nextEndTime = endTime + nextSeriesDefinition.duration;

      customParams.currentSeriesIndex = nextSeriesIndex;
      customParams.currentSeries = {
        endTime: nextEndTime,
        seriesDefinition: nextSeriesDefinition,
        startTime: endTime,
      };
    }

    const {
      seriesDefinition: { indexedColors, speedScale, seriesDirection },
      startTime,
    } = customParams.currentSeries;
    const localTimeElapsed = timeElapsed - startTime;

    const combinedLength = indexedColors.length;
    const offset = speedScale(localTimeElapsed);

    for (const [index, light] of this.lightsIterator({
      seriesDirection,
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
