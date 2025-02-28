// import Broadcaster from '../Broadcaster';
// import { scalePow, ScalePower, scaleSequential } from 'd3-scale';
// import AnimatedMacroBase from './AnimatedMacroBase';
// import { interpolateSinebow } from 'd3-scale-chromatic';
// import { color } from 'd3-color';
// import LEDSystem from '../LEDSystem';

// type Config = {
//   spread?: number;
//   gap?: number;
//   frequencyInSeconds?: number;
//   direction?: 'forward' | 'reverse';
//   color?: 'rainbow' | string;
// };

// export default class BasicChase extends AnimatedMacroBase {
//   #ledSystem: LEDSystem;
//   #spread: number;
//   #gap: number;
//   #frequencyInSeconds: number;
//   #direction: 'forward' | 'reverse' = 'forward';
//   #scale: ScalePower<number, number>;
//   #colorScale: (num: number) => string;

//   constructor(
//     broadcaster: Broadcaster,
//     ledSystem: LEDSystem,
//     {
//       spread = 2,
//       gap = 10,
//       frequencyInSeconds = 1,
//       direction = 'forward',
//       color = 'white',
//     }: Config,
//   ) {
//     super(broadcaster);
//     this.#ledSystem = ledSystem;
//     this.#spread = spread;
//     this.#gap = gap;
//     this.#frequencyInSeconds = frequencyInSeconds;
//     this.#direction = direction;
//     this.#scale = scalePow()
//       .domain([0, this.#spread])
//       .rangeRound([100, 0])
//       .exponent(2)
//       .clamp(true);

//     this.#colorScale =
//       color === 'rainbow'
//         ? scaleSequential(interpolateSinebow).domain([
//             0,
//             this.#ledSystem.countLights - 1,
//           ])
//         : () => color;
//   }

//   onStop() {
//     this.#ledSystem.turnAllOff();
//     this.broadcast();
//   }

//   tick() {
//     const stepsSinceStart =
//       this.msSinceStart / (1000 / this.#frequencyInSeconds);

//     for (const [index, light] of this.#ledSystem.getLightsIterator()) {
//       const adjustedIndex = Math.abs(
//         this.#direction === 'forward'
//           ? index - stepsSinceStart
//           : index + stepsSinceStart,
//       );
//       const remainder = adjustedIndex % this.#gap;
//       const deltaToNext = Math.min(remainder, this.#gap - remainder);
//       const percent = this.#scale(deltaToNext);

//       const baseColor = this.#colorScale(index);
//       const transformedColor =
//         color(baseColor)?.copy({ opacity: percent / 100 }) ?? color('black');

//       light.setColor(transformedColor);
//     }

//     this.broadcast();
//   }
// }
