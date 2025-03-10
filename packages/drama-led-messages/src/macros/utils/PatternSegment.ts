import { z } from 'zod';

const SolidSegment = z.object({
  type: z.literal('solid'),
  length: z.number(),
  color: z.string(),
});

const GradientSegment = z.object({
  type: z.literal('gradient'),
  length: z.number(),
  startColor: z.string(),
  endColor: z.string(),
});

export const PatternSegment = z.discriminatedUnion('type', [
  SolidSegment,
  GradientSegment,
]);

export type PatternSegment = z.infer<typeof PatternSegment>;
