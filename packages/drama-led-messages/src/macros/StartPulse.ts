import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartPulse = StartBaseMacro.extend({
  type: z.literal('START_PULSE_PATTERN'),
  data: z.object({
    durationPerLight: z.number().min(0),
    rampUpDuration: z.number().min(0),
    color: z.string(),
    density: z.number().min(0).max(100),
  }),
});

export type StartPulse = z.infer<typeof StartPulse>;

export const EXAMPLES: Record<string, StartPulse> = {
  'Slow Star Pulse': {
    type: 'START_PULSE_PATTERN',
    cueID: 'pulse-1',
    segment: 'ALL_ARCHES_FULL',
    data: {
      durationPerLight: 2000,
      rampUpDuration: 5000,
      color: 'rgb(255,255,255)',
      density: 10,
    },
  },
};
