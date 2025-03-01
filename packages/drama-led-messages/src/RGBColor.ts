import { RGBValue } from './AddressTypes';
import { z } from 'zod';

export const RGBColor = z.object({
  red: RGBValue,
  green: RGBValue,
  blue: RGBValue,
});

export type RGBColor = z.infer<typeof RGBColor>;
