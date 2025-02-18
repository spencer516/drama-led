import Broadcaster from '../Broadcaster';
import LEDSystem from '../LEDSystem';
import Light from '../Light';
import AnimatedMacroBase from './AnimatedMacroBase';

export default class RandomSparkle extends AnimatedMacroBase {
  #getLightsIterator: () => Iterable<[number, Light]>;

  constructor(
    broadcaster: Broadcaster,
    getLightsIterator: () => Iterable<[number, Light]>,
  ) {
    super(broadcaster);
    this.#getLightsIterator = getLightsIterator;
    this.setFPS(20);
  }

  tick() {
    for (const [, light] of this.#getLightsIterator()) {
      if (Math.random() > 0.8) {
        light.turnOn();
      } else {
        light.turnOff();
      }
    }

    this.broadcast();
  }

  onStop() {
    for (const [, light] of this.#getLightsIterator()) {
      light.turnOff();
    }
    this.broadcast();
  }
}
