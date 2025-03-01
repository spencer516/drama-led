import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartBasicChase = StartBaseMacro.extend({
  type: z.literal('START_BASIC_CHASE'),
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
