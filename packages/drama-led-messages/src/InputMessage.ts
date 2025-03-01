import { z } from 'zod';
import { LightID, RGBValue } from './AddressTypes';

export const RGBColor = z.object({
  red: RGBValue,
  green: RGBValue,
  blue: RGBValue,
});

export const NamedLEDSection = z.union([
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
]);

export type NamedLEDSection = z.infer<typeof NamedLEDSection>;

export type RGBColor = z.infer<typeof RGBColor>;

export const EmptyMessage = z.object({
  type: z.literal('EMPTY_MESSAGE'),
});

export const UpdateQLabReceiver = z.object({
  type: z.literal('UPDATE_QLAB_RECEIVER'),
  data: z.object({
    isEnabled: z.boolean(),
  }),
});

export const UpdateLightByID = z.object({
  type: z.literal('UPDATE_LIGHT_BY_ID'),
  data: z.object({
    id: LightID,
    rgb: RGBColor,
  }),
});

export type UpdateLightByID = z.infer<typeof UpdateLightByID>;

export const UpdateAllLights = z.object({
  type: z.literal('UPDATE_ALL_LIGHTS'),
  data: z.object({
    rgb: RGBColor,
  }),
});

export type UpdateAllLights = z.infer<typeof UpdateAllLights>;

export const StartBasicChase = z.object({
  type: z.literal('START_BASIC_CHASE'),
  data: z.object({
    id: z.string(),
    segment: NamedLEDSection,
    spread: z.number().min(0).max(50).optional(),
    gap: z.number().min(0).max(50).optional(),
    maxFPS: z.number().min(0).max(60).optional(),
    direction: z.enum(['forward', 'reverse']).optional(),
    color: z
      .enum(['rainbow', 'white', 'red', 'green', 'blue', 'yellow'])
      .optional(),
  }),
});

export const StartRadialChase = z.object({
  type: z.literal('START_RADIAL_CHASE'),
  data: z.object({}),
});

export const StartRandomSparkle = z.object({
  type: z.literal('START_RANDOM_SPARKLE'),
  data: z.object({
    segment: NamedLEDSection,
  }),
});

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

export const TurnAllOn = z.object({
  type: z.literal('TURN_ALL_ON'),
  data: z.object({}),
});

export const TurnAllOff = z.object({
  type: z.literal('TURN_ALL_OFF'),
  data: z.object({}),
});

export const UpdateOctoController = z.object({
  type: z.literal('UPDATE_CONTROLLER'),
  data: z.object({
    id: z.string(),
    isSACNEnabled: z.boolean(),
  }),
});

export type StartBasicChase = z.infer<typeof StartBasicChase>;

export const InputMessage = z.discriminatedUnion('type', [
  UpdateLightByID,
  UpdateAllLights,
  StartBasicChase,
  StartRadialChase,
  StartRandomSparkle,
  StartShimmerAnimation,
  EmptyMessage,
  TurnAllOn,
  TurnAllOff,
  UpdateOctoController,
  UpdateQLabReceiver,
]);

export type InputMessage = z.infer<typeof InputMessage>;

export function parseMessage(data: string): InputMessage {
  const obj = JSON.parse(data);
  return InputMessage.parse(obj);
}

export function safeParseMessage(data: string): InputMessage {
  const obj = JSON.parse(data);
  const result = InputMessage.safeParse(obj);

  if (result.success) {
    return result.data;
  }

  return InputMessage.parse({ type: 'EMPTY_MESSAGE' });
}
