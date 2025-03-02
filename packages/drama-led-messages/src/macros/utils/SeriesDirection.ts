import { z } from 'zod';

export const SeriesDirection = z.union([
  z.literal('top-to-bottom'),
  z.literal('bottom-to-top'),
  z.literal('left-to-right'),
  z.literal('right-to-left'),
]);

export type SeriesDirection = z.infer<typeof SeriesDirection>;
