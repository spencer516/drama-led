import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

const PatternSegment = z.object({
  length: z.number(),
  color: z.string(),
});

export const StartStaticPattern = StartBaseMacro.extend({
  type: z.literal('START_STATIC_PATTERN'),
  data: z.object({
    pattern: z.array(PatternSegment),
  }),
});

export type StartStaticPattern = z.infer<typeof StartStaticPattern>;

export const EXAMPLES: Record<string, StartStaticPattern> = {
  'Pink/White Stripes': {
    type: 'START_STATIC_PATTERN',
    cueID: 'cue-static-1',
    segment: 'ALL_ARCHES_FULL',
    data: {
      pattern: [
        {
          length: 5,
          color: 'rgb(255,255,255)',
        },
        {
          length: 10,
          color: 'rgb(255,50,50)',
        },
      ],
    },
  },
};
