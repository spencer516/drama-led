import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartBasicChase = StartBaseMacro.extend({
  type: z.literal('START_BASIC_CHASE'),
  data: z.object({
    spread: z.number().min(0).max(50).optional(),
    gap: z.number().min(0).max(50).optional(),
    speed: z.number().min(0),
    direction: z.enum(['forward', 'reverse']).optional(),
    color: z
      .enum(['rainbow', 'white', 'red', 'green', 'blue', 'yellow'])
      .optional(),
  }),
});

export type StartBasicChase = z.infer<typeof StartBasicChase>;

export const EXAMPLES: Record<string, StartBasicChase> = {
  'Red Chase': {
    type: 'START_BASIC_CHASE',
    cueID: 'chase-1',
    segment: 'ALL_ARCHES_FULL',
    data: {
      spread: 5,
      gap: 15,
      direction: 'reverse',
      color: 'red',
      speed: 10,
    },
  },
  'Rainbow Chase': {
    type: 'START_BASIC_CHASE',
    cueID: 'chase-2',
    segment: 'ALL_ARCHES_FULL',
    data: {
      spread: 5,
      gap: 15,
      direction: 'reverse',
      color: 'rainbow',
      speed: 10,
    },
  },
};
