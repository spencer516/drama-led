import { z } from 'zod';
import { NamedLEDSection } from '../NamedLEDSection';

export const StartBaseMacro = z.object({
  cueID: z.string(),
  segment: NamedLEDSection,
  fadeIn: z
    .object({
      duration: z.number().min(0),
    })
    .optional(),
  fadeOut: z
    .object({
      duration: z.number().min(0),
    })
    .optional(),
});
