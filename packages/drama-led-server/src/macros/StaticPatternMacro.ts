import { StartStaticPattern } from '@spencer516/drama-led-messages';
import StaticMacro from './StaticMacro';
import { makeIndexedColors } from './utils/pattern-utils';

export default class StaticPatternMacro extends StaticMacro<
  StartStaticPattern['data']
> {
  setupLights() {
    const indexedColors = makeIndexedColors(this.data.pattern);
    const combinedLength = indexedColors.length;
    const offset = this.data.offset ?? 0;

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
