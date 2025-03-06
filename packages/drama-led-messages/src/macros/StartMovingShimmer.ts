import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartMovingShimmer = StartBaseMacro.extend({
  type: z.literal('START_MOVING_SHIMMER'),
  data: z.object({
    duration: z.number(),
    density: z.number().min(0).max(100),
    direction: z.enum(['UP', 'DOWN']),
    spread: z.number().min(0).max(100),
    decay: z.number().min(0).max(100),
    slopeEffect: z.number().min(0).max(100),
    color: z.string().optional(),
    backgroundColor: z.string().optional()
  }),
});

export type StartMovingShimmer = z.infer<typeof StartMovingShimmer>;

export const EXAMPLES: Record<string, StartMovingShimmer> = {
  'Shimmer Move Up': {
    type: 'START_MOVING_SHIMMER',
    cueID: 'cue-movingshimmer-1',
    segment: 'ALL_ARCHES_FULL',
    data: {
      duration: 3000,
      density: 10,
      direction: 'UP',
      spread: 20,
      decay: 80,
      slopeEffect: 60,
      color: 'yellow',
      backgroundColor: 'green'
    },
  },
};
