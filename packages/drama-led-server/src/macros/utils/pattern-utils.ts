import { PatternSegment } from '@spencer516/drama-led-messages';
import { color as d3Color, RGBColor } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';

export type IndexedColors = (RGBColor | undefined)[];

export function makeIndexedColors(pattern: PatternSegment[]): IndexedColors {
  const indexedColors: IndexedColors = [];

  for (const segment of pattern) {
    switch (segment.type) {
      case 'solid':
        const color = d3Color(segment.color)?.rgb().clamp();

        for (let i = 0; i < segment.length; i++) {
          indexedColors.push(color);
        }
        break;
      case 'gradient':
        const colorScale = scaleLinear<string>()
          .domain([0, segment.length - 1])
          .range([segment.startColor, segment.endColor])
          .interpolate(interpolateRgb);

        for (let i = 0; i < segment.length; i++) {
          indexedColors.push(d3Color(colorScale(i))?.rgb().clamp());
        }
    }
  }
  return indexedColors;
}
