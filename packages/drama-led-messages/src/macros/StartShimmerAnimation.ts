import { z } from 'zod';
import { NamedLEDSection } from '../NamedLEDSection';
import { RGBColor } from '../RGBColor';

export const StartShimmerAnimation = z.object({
  type: z.literal('START_SHIMMER'),
  cueID: z.string(),
  segment: NamedLEDSection,
  data: z.object({
    speed: z.number().min(0).max(100),
    density: z.number().min(0).max(100),
    color: RGBColor,
  }),
});

export type StartShimmerAnimation = z.infer<typeof StartShimmerAnimation>;
