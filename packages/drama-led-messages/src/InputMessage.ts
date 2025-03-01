import { z } from 'zod';
import { LightID } from './AddressTypes';
import { AllMacros } from './macros/AllMacros';
import { RGBColor } from './RGBColor';

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

export const StopMacro = z.object({
  type: z.literal('STOP_MACRO'),
  cueID: z.string(),
});

export const StopAllMacros = z.object({
  type: z.literal('STOP_ALL_MACROS'),
});

export const InputMessage = z.discriminatedUnion('type', [
  UpdateLightByID,
  UpdateAllLights,
  EmptyMessage,
  TurnAllOn,
  TurnAllOff,
  UpdateOctoController,
  UpdateQLabReceiver,
  StopMacro,
  StopAllMacros,
  ...AllMacros,
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
