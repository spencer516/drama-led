import { StartStaticPattern } from '@spencer516/drama-led-messages/src/macros/StartStaticPattern';
import StaticMacro from './StaticMacro';
import { color as d3Color, RGBColor } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';

export default class StaticPatternMacro extends StaticMacro<
  StartStaticPattern['data']
> {
  setupLights() {
    const indexedColors: (RGBColor | undefined)[] = [];

    for (const segment of this.data.pattern) {
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

    const combinedLength = indexedColors.length;

    for (const [index, light] of this.lightsIterator()) {
      const offset = index % combinedLength;
      const color = indexedColors.at(offset);

      if (color != null) {
        light.setColor(color);
      }
    }
  }
}
