import AnimatedMacroBase from './AnimatedMacroBase';
import Broadcaster from '../Broadcaster';
import LEDSystem from '../LEDSystem';
import Light from '../Light';

export default class RadialChase extends AnimatedMacroBase {
  #ledSystem: LEDSystem;

  constructor(broadcaster: Broadcaster, ledSystem: LEDSystem) {
    super(broadcaster);
    this.#ledSystem = ledSystem;
  }

  onStop() {
    this.#ledSystem.turnAllOff();
    this.broadcast();
  }
}
