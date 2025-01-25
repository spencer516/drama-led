import {z} from 'zod';
import {LightID, RGBValue} from './AddressTypes';

export const RGBColor = z.object({
  red: RGBValue,
  green: RGBValue,
  blue: RGBValue,
});

export type RGBColor = z.infer<typeof RGBColor>;

export const EmptyMessage = z.object({
  type: z.literal('EMPTY_MESSAGE'),
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
    spread: z.number().min(0).max(50).optional(),
    gap: z.number().min(0).max(50).optional(),
    frequencyInSeconds: z.number().min(0).max(50).optional(),
    direction: z.enum(['forward', 'reverse']).optional(),
    color: z.enum(['rainbow', 'white', 'red', 'green', 'blue', 'yellow']).optional(),
  }),
});

export const StartRadialChase = z.object({
  type: z.literal('START_RADIAL_CHASE'),
  data: z.object({}),
});

export type StartBasicChase = z.infer<typeof StartBasicChase>;

export const InputMessage = z.discriminatedUnion('type', [
  UpdateLightByID,
  UpdateAllLights,
  StartBasicChase,
  StartRadialChase,
  EmptyMessage,
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

  return InputMessage.parse({type: 'EMPTY_MESSAGE'});
}
