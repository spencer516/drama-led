import { z } from 'zod';
import { RGBColor } from '../RGBColor';
import { StartBaseMacro } from './StartBaseMacro';

export const StartShimmerAnimation = StartBaseMacro.extend({
  type: z.literal('START_SHIMMER'),
  data: z.object({
    speed: z.number().min(0).max(100),
    density: z.number().min(0).max(100),
    color: RGBColor,
  }),
});

export type StartShimmerAnimation = z.infer<typeof StartShimmerAnimation>;
