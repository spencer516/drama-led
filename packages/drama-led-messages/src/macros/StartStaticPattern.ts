import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';
import PatternSegment from './utils/PatternSegment';

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
          type: 'solid',
          length: 5,
          color: 'rgb(255,255,255)',
        },
        {
          type: 'solid',
          length: 10,
          color: 'rgb(255,50,50)',
        },
      ],
    },
  },
  'Gradient Stripes': {
    type: 'START_STATIC_PATTERN',
    cueID: 'cue-static-1',
    segment: 'ALL_ARCHES_FULL',
    data: {
      pattern: [
        {
          type: 'gradient',
          length: 3,
          startColor: 'rgb(131,58,180)', // Purple
          endColor: 'rgb(253,29,29)', // Red
        },
        {
          type: 'gradient',
          length: 6,
          startColor: 'rgb(253,29,29)', // Red
          endColor: 'rgb(252,176,69)', // Orange
        },
        {
          type: 'gradient',
          length: 6,
          startColor: 'rgb(252,176,69)', // Orange
          endColor: 'rgb(253,29,29)', // Red
        },
        {
          type: 'gradient',
          length: 3,
          startColor: 'rgb(253,29,29)', // Red
          endColor: 'rgb(131,58,180)', // Purple
        },
      ],
    },
  },
};
