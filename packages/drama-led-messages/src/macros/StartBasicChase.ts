import { z } from 'zod';
import { NamedLEDSection } from '../NamedLEDSection';

export const StartBasicChase = z.object({
  type: z.literal('START_BASIC_CHASE'),
  cueID: z.string(),
  segment: NamedLEDSection,
  data: z.object({
    spread: z.number().min(0).max(50).optional(),
    gap: z.number().min(0).max(50).optional(),
    maxFPS: z.number().min(0).max(60).optional(),
    direction: z.enum(['forward', 'reverse']).optional(),
    color: z
      .enum(['rainbow', 'white', 'red', 'green', 'blue', 'yellow'])
      .optional(),
  }),
});

export type StartBasicChase = z.infer<typeof StartBasicChase>;
