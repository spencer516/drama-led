import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartShimmerAnimation = StartBaseMacro.extend({
  type: z.literal('START_SHIMMER'),
  data: z.object({
    speed: z.number().min(0).max(100),
    density: z.number().min(0).max(100),
    color: z.string(),
  }),
});

export type StartShimmerAnimation = z.infer<typeof StartShimmerAnimation>;

export const EXAMPLES: Record<string, StartShimmerAnimation> = {
  Shimmer: {
    type: 'START_SHIMMER',
    cueID: 'shimmer-1',
    segment: 'FULL_ARCH_STAGE_LEFT',
    data: {
      speed: 40,
      density: 20,
      color: `rgb(255,251,212)`,
    },
  },
};
