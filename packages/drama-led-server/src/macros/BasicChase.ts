import { makeChannelValue } from "@spencer516/drama-led-messages/src/AddressTypes";
import Broadcaster from "../Broadcaster";
import Light from "../Light";
import LightSequence from "../LightSequence";
import { scalePow, ScalePower, scaleSequential, ScaleSequential } from 'd3-scale';
import AnimatedMacroBase from "./AnimatedMacroBase";
import { interpolateSinebow } from "d3-scale-chromatic";
import { color } from "d3-color";

type Config = {
  spread?: number;
  gap?: number;
  frequencyInSeconds?: number;
  direction?: 'forward' | 'reverse';
  color?: 'rainbow' | string;
}

export default class BasicChase extends AnimatedMacroBase {
  #linearSequence: Light[];
  #spread: number;
  #gap: number;
  #frequencyInSeconds: number;
  #direction: 'forward' | 'reverse' = 'forward';
  #scale: ScalePower<number, number>;
  #colorScale: (num: number) => string;

  constructor(
    broadcaster: Broadcaster,
    lightSequence: LightSequence,
    {
      spread = 2,
      gap = 10,
      frequencyInSeconds = 1,
      direction = 'forward',
      color = 'white',
    }: Config,
  ) {
    super(broadcaster);
    this.#linearSequence = lightSequence.toLinearSequence();
    this.#spread = spread;
    this.#gap = gap;
    this.#frequencyInSeconds = frequencyInSeconds;
    this.#direction = direction;
    this.#scale = scalePow().domain([0, this.#spread]).rangeRound([100, 0]).exponent(2).clamp(true);
    this.#colorScale = color === 'rainbow' ? scaleSequential(interpolateSinebow).domain([0, this.#linearSequence.length - 1]) : () => color;
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

      const baseColor = this.#colorScale(index);
      const transformedColor = color(baseColor)?.copy({ opacity: percent / 100 }) ?? color('black');

      light.setColor(transformedColor);
    });

    this.broadcast();
  }
}