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
  StartMovingShimmer,
  EXAMPLES as MovingShimmerExamples,
} from './StartMovingShimmer';

export const AllMacros = [
  StartRandomSparkle,
  StartBasicChase,
  StartShimmerAnimation,
  StartStaticPattern,
  StartMovingShimmer,
];

export const MACRO_EXAMPLES = {
  ...RandomSparkleExamples,
  ...BasicChaseExamples,
  ...ShimmerAnimationExamples,
  ...StaticPatternExamples,
  ...MovingShimmerExamples,
};
