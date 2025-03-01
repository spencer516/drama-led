import { StartStaticPattern } from '@spencer516/drama-led-messages/src/macros/StartStaticPattern';
import StaticMacro from './StaticMacro';

export default class StaticPatternMacro extends StaticMacro<
  StartStaticPattern['data']
> {
  setupLights() {
    for (const [index, light] of this.lightsIterator()) {
      light.turnOn();
    }
  }
}
