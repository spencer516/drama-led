import { makeChannelValue } from "@spencer516/drama-led-messages/src/AddressTypes";
import Broadcaster from "../Broadcaster";
import Light from "../Light";
import LightSequence from "../LightSequence";
import { scalePow, ScalePower } from 'd3-scale';
import AnimatedMacroBase from "./AnimatedMacroBase";

type Config = {
  spread?: number;
  gap?: number;
  frequencyInSeconds?: number;
  direction?: 'forward' | 'reverse';
}

export default class BasicChase extends AnimatedMacroBase {
  #linearSequence: Light[];
  #spread: number;
  #gap: number;
  #frequencyInSeconds: number;
  #direction: 'forward' | 'reverse' = 'forward';
  #scale: ScalePower<number, number>;

  constructor(
    broadcaster: Broadcaster,
    lightSequence: LightSequence,
    {
      spread = 2,
      gap = 10,
      frequencyInSeconds = 1,
      direction = 'forward',
    }: Config,
  ) {
    super(broadcaster);
    this.#linearSequence = lightSequence.toLinearSequence();
    this.#spread = spread;
    this.#gap = gap;
    this.#frequencyInSeconds = frequencyInSeconds;
    this.#direction = direction;
    this.#scale = scalePow().domain([0, this.#spread]).rangeRound([100, 0]).exponent(2).clamp(true);
  }

  onStop() {
    this.#linearSequence.forEach(light => {
      light.turnOff();
    });

    this.broadcast();
  }

  tick() {
    const stepsSinceStart = this.msSinceStart / (1000 / this.#frequencyInSeconds);

    this.#linearSequence.forEach((light, index) => {
      const adjustedIndex = Math.abs(this.#direction === 'forward' ? index - stepsSinceStart : index + stepsSinceStart);
      const remainder = adjustedIndex % this.#gap;
      const deltaToNext = Math.min(remainder, this.#gap - remainder);
      const percent = this.#scale(deltaToNext);

      light.setValue([
        makeChannelValue(percent),
        makeChannelValue(percent),
        makeChannelValue(percent),
      ]);
    });

    this.broadcast();
  }
}