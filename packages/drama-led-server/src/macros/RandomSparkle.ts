import Broadcaster from '../Broadcaster';
import LEDSystem from '../LEDSystem';
import AnimatedMacroBase from './AnimatedMacroBase';

export default class RandomSparkle extends AnimatedMacroBase {
  #ledSystem: LEDSystem;

  constructor(broadcaster: Broadcaster, ledSystem: LEDSystem) {
    super(broadcaster);
    this.#ledSystem = ledSystem;
    this.setFPS(10);
  }

  tick() {
    for (const [_, light] of this.#ledSystem.getLightsIterator()) {
      if (Math.random() > 0.8) {
        light.turnOn();
      } else {
        light.turnOff();
      }
    }

    this.broadcast();
  }

  onStop() {
    this.#ledSystem.turnAllOff();
    this.broadcast();
  }
}
