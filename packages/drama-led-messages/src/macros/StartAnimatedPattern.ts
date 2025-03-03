import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';
import { PatternSegment } from './utils/PatternSegment';
import { SeriesDirection } from './utils/SeriesDirection';

export const StartAnimatedPattern = StartBaseMacro.extend({
  type: z.literal('START_ANIMATED_PATTERN'),
  data: z.object({
    seriesDirection: SeriesDirection,
    speed: z.number().min(0),
    pattern: z.array(PatternSegment),
  }),
});

export type StartAnimatedPattern = z.infer<typeof StartAnimatedPattern>;

export const EXAMPLES: Record<string, StartAnimatedPattern> = {
  'Animated Stripes': {
    type: 'START_ANIMATED_PATTERN',
    cueID: 'cut-animated-pattern-1',
    segment: 'ALL_ARCHES_FULL',
    fadeIn: {
      duration: 2000,
    },
    data: {
      seriesDirection: 'top-to-bottom',
      speed: 10,
      pattern: [
        {
          type: 'solid',
          length: 2,
          color: 'rgb(0,255,0)',
        },
        {
          type: 'solid',
          length: 2,
          color: 'rgb(255,0,0)',
        },
      ],
    },
  },
  'Solid Red': {
    type: 'START_ANIMATED_PATTERN',
    cueID: 'cut-animated-pattern-1',
    segment: 'ALL_ARCHES_FULL',
    fadeIn: {
      duration: 2000,
    },
    data: {
      seriesDirection: 'top-to-bottom',
      speed: 10,
      pattern: [
        {
          type: 'solid',
          length: 2,
          color: 'rgb(255,0,0)',
        },
      ],
    },
  },
};
