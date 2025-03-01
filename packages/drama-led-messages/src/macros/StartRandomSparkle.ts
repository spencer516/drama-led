import { z } from 'zod';
import { NamedLEDSection } from '../NamedLEDSection';

export const StartRandomSparkle = z.object({
  type: z.literal('START_RANDOM_SPARKLE'),
  cueID: z.string(),
  segment: NamedLEDSection,
  data: z.object({
    maxFPS: z.number().min(0).max(60).optional(),
    duration: z.number().min(0),
  }),
});

export type StartRandomSparkle = z.infer<typeof StartRandomSparkle>;
