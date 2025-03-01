import { scalePow, ScalePower, scaleSequential } from 'd3-scale';
import LoopingAnimationMacro from './LoopingAnimationMacro';
import { interpolateSinebow } from 'd3-scale-chromatic';
import { color } from 'd3-color';
import Animator from '../Animator';
import { TGetLightsIterator } from './AnimationMacroBase';

type Config = {
  spread?: number;
  gap?: number;
  direction?: 'forward' | 'reverse';
  color?: 'rainbow' | string;
  maxFPS?: number;
};

export default class BasicChase extends LoopingAnimationMacro {
  #spread: number;
  #gap: number;
  #direction: 'forward' | 'reverse' = 'forward';
  #scale: ScalePower<number, number>;
  #colorScale: (num: number) => string;

  constructor(
    id: string,
    animator: Animator,
    getLightsIterator: TGetLightsIterator,
    {
      spread = 2,
      gap = 10,
      direction = 'forward',
      color = 'white',
      maxFPS = 30,
    }: Config,
  ) {
    super(id, animator, getLightsIterator, { maxFPS });

    this.#spread = spread;
    this.#gap = gap;
    this.#direction = direction;
    this.#scale = scalePow()
      .domain([0, this.#spread])
      .rangeRound([100, 0])
      .exponent(2)
      .clamp(true);

    this.#colorScale =
      color === 'rainbow'
        ? scaleSequential(interpolateSinebow).domain([
            0,
            Array.from(getLightsIterator()).length - 1,
          ])
        : () => color;
  }

  tick(_timeElapsed: number, frameNumber: number) {
    for (const [index, light] of this.getLightsIterator()) {
      const adjustedIndex = Math.abs(
        this.#direction === 'forward'
          ? index - frameNumber
          : index + frameNumber,
      );
      const remainder = adjustedIndex % this.#gap;
      const deltaToNext = Math.min(remainder, this.#gap - remainder);
      const percent = this.#scale(deltaToNext);

      const baseColor = this.#colorScale(index);
      const transformedColor =
        color(baseColor)?.copy({ opacity: percent / 100 }) ?? color('black');

      light.setColor(transformedColor);
    }
  }
}
