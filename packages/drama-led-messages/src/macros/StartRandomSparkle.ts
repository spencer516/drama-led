import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartRandomSparkle = StartBaseMacro.extend({
  type: z.literal('START_RANDOM_SPARKLE'),
  data: z.object({
    duration: z.number().min(0),
  }),
});

export type StartRandomSparkle = z.infer<typeof StartRandomSparkle>;

export const EXAMPLES: Record<string, StartRandomSparkle> = {
  Sparkle: {
    type: 'START_RANDOM_SPARKLE',
    segment: 'ALL_ARCHES_INNER',
    cueID: 'sparkle-1',
    data: {
      duration: 3000,
    },
  },
};
