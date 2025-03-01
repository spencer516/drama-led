import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartStaticPattern = StartBaseMacro.extend({
  type: z.literal('START_STATIC_PATTERN'),
  data: z.object({
    pattern: z.string(),
  }),
});

export type StartStaticPattern = z.infer<typeof StartStaticPattern>;

export const EXAMPLES: Record<string, StartStaticPattern> = {
  'Pink/White Stripes': {
    type: 'START_STATIC_PATTERN',
    cueID: 'cue-static-1',
    segment: 'ALL_ARCHES_FULL',
    data: {
      pattern: 'foo',
    },
  },
};
