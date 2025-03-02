import {
  StartRandomSparkle,
  EXAMPLES as RandomSparkleExamples,
} from './StartRandomSparkle';

import {
  StartBasicChase,
  EXAMPLES as BasicChaseExamples,
} from './StartBasicChase';

import {
  StartShimmerAnimation,
  EXAMPLES as ShimmerAnimationExamples,
} from './StartShimmerAnimation';

import {
  StartStaticPattern,
  EXAMPLES as StaticPatternExamples,
} from './StartStaticPattern';

import {
  StartAnimatedPattern,
  EXAMPLES as AnimatedPatternExamples,
} from './StartAnimatedPattern';

import {
  StartMovingShimmer,
  EXAMPLES as MovingShimmerExamples,
} from './StartMovingShimmer';

import { StartPulse, EXAMPLES as PulseExamples } from './StartPulse';

export const AllMacros = [
  StartRandomSparkle,
  StartBasicChase,
  StartShimmerAnimation,
  StartStaticPattern,
  StartMovingShimmer,
  StartAnimatedPattern,
  StartPulse,
];

export const MACRO_EXAMPLES = {
  ...RandomSparkleExamples,
  ...BasicChaseExamples,
  ...ShimmerAnimationExamples,
  ...StaticPatternExamples,
  ...MovingShimmerExamples,
  ...AnimatedPatternExamples,
  ...PulseExamples,
};
