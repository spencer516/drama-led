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

export const AllMacros = [
  StartRandomSparkle,
  StartBasicChase,
  StartShimmerAnimation,
  StartStaticPattern,
];

export const MACRO_EXAMPLES = {
  ...RandomSparkleExamples,
  ...BasicChaseExamples,
  ...ShimmerAnimationExamples,
  ...StaticPatternExamples,
};
