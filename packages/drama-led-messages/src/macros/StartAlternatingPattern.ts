import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';
import { PatternSegment } from './utils/PatternSegment';
import { SeriesDirection } from './utils/SeriesDirection';

export const StartAlternatingPattern = StartBaseMacro.extend({
  type: z.literal('START_ALTERNATING_PATTERN'),
  data: z.object({
    series: z
      .array(
        z.object({
          seriesDirection: SeriesDirection,
          duration: z.number().min(1),
          speed: z.number().min(0),
          pattern: z.array(PatternSegment),
        }),
      )
      .min(1),
  }),
});

export type StartAlternatingPattern = z.infer<typeof StartAlternatingPattern>;

export const EXAMPLES: Record<string, StartAlternatingPattern> = {
  'Alternating Stripes': {
    type: 'START_ALTERNATING_PATTERN',
    cueID: 'alternating-stripes',
    segment: 'ALL_ARCHES_FULL',
    fadeIn: {
      duration: 100,
    },
    data: {
      series: [
        {
          seriesDirection: 'top-to-bottom',
          speed: 10,
          duration: 5000,
          pattern: [
            {
              type: 'solid',
              length: 5,
              color: 'rgb(255,0,0)',
            },
            {
              type: 'solid',
              length: 5,
              color: 'rgb(0,255,0)',
            },
          ],
        },
        {
          seriesDirection: 'bottom-to-top',
          speed: 10,
          duration: 3000,
          pattern: [
            {
              type: 'solid',
              length: 5,
              color: 'rgb(255,255,0)',
            },
            {
              type: 'solid',
              length: 5,
              color: 'rgb(0,255,255)',
            },
          ],
        },
      ],
    },
  },
};
