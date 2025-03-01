import { z } from 'zod';
import { NamedLEDSection } from '../NamedLEDSection';

export const StartRandomSparkle = z.object({
  type: z.literal('START_RANDOM_SPARKLE'),
  data: z.object({
    segment: NamedLEDSection,
  }),
});

export type StartRandomSparkle = z.infer<typeof StartRandomSparkle>;
