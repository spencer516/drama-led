import { makeChannelValue } from "@spencer516/drama-led-messages/src/AddressTypes";
import Broadcaster from "../Broadcaster";
import Light from "../Light";
import LightSequence from "../LightSequence";
import MacroBase from "./MacroBase";

export default class BasicChase extends MacroBase {
  #linearSequence: Light[];
  #intervalConfig: {
    startTime: number,
    timeout: NodeJS.Timeout | null,
  };

  constructor(
    broadcaster: Broadcaster,
    lightSequence: LightSequence
  ) {
    super(broadcaster);
    this.#linearSequence = lightSequence.toLinearSequence();
    this.#intervalConfig = {
      startTime: 0,
      timeout: null,
    }
  }

  start() {
    const interval = setInterval(() => {
      this.tick();
    }, 16);

    this.#intervalConfig = {
      startTime: performance.now(),
      timeout: interval,
    };

    this.tick();
  }

  stop() {
    if (this.#intervalConfig.timeout != null) {
      clearInterval(this.#intervalConfig.timeout);
    }

    this.#linearSequence.forEach(light => {
      light.turnOff();
    });

    this.broadcast();
  }

  get msSinceStart() {
    return performance.now() - this.#intervalConfig.startTime;
  }

  tick() {
    const gap = 5;
    const spread = 1.5;
    const frequency = 300;

    const currentValue = (this.msSinceStart / frequency) % gap;

    this.#linearSequence.forEach((light, index) => {
      const indexValue = index % gap;

      // TODO: Use d3 scale here...it's better.
      const deltaToTarget = Math.min(
        spread,
        Math.abs(currentValue - indexValue),
        Math.abs(currentValue + indexValue),
      );

      const percent = Math.round(100 * (1 - (deltaToTarget / spread)));

      light.setValue([
        makeChannelValue(percent),
        makeChannelValue(percent),
        makeChannelValue(percent),
      ]);
    });

    this.broadcast();
  }
}