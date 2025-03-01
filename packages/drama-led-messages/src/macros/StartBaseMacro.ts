import { z } from 'zod';
import { NamedLEDSection } from '../NamedLEDSection';

export const StartBaseMacro = z.object({
  cueID: z.string(),
  segment: NamedLEDSection,
});
