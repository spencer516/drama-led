import { z } from 'zod';

const NamedLEDSection = z.union([
  z.literal('FULL_ARCH_STAGE_LEFT'),
  z.literal('FULL_ARCH_CENTER'),
  z.literal('FULL_ARCH_STAGE_RIGHT'),
  z.literal('INNER_ARCH_STAGE_LEFT'),
  z.literal('INNER_ARCH_CENTER'),
  z.literal('INNER_ARCH_STAGE_RIGHT'),
  z.literal('OUTER_ARCH_STAGE_LEFT'),
  z.literal('OUTER_ARCH_CENTER'),
  z.literal('OUTER_ARCH_STAGE_RIGHT'),
  z.literal('ALL_ARCHES_FULL'),
  z.literal('ALL_ARCHES_OUTER'),
  z.literal('ALL_ARCHES_INNER'),
  z.literal('HOUSE'),
]);

export { NamedLEDSection };

export type NamedLEDSection = z.infer<typeof NamedLEDSection>;
