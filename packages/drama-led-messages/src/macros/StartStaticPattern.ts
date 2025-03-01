import { z } from 'zod';
import { StartBaseMacro } from './StartBaseMacro';

export const StartStaticPattern = StartBaseMacro.extend({
  type: z.literal('START_STATIC_PATTERN'),
  data: z.object({
    pattern: z.string(),
  }),
});

export type StartStaticPattern = z.infer<typeof StartStaticPattern>;
