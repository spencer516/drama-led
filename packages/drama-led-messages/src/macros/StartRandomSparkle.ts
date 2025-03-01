import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartRandomSparkle = StartBaseMacro.extend({
  type: z.literal('START_RANDOM_SPARKLE'),
  data: z.object({
    maxFPS: z.number().min(0).max(60).optional(),
    duration: z.number().min(0),
  }),
});

export type StartRandomSparkle = z.infer<typeof StartRandomSparkle>;
