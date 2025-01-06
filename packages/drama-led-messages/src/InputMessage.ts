import { z } from 'zod';
import { ChannelValue } from './AddressTypes';

const Channel = z.object({
  red: ChannelValue,
  green: ChannelValue,
  blue: ChannelValue,
});

type Channel = z.infer<typeof Channel>;

export const EmptyMessage = z.object({
  type: z.literal('EMPTY_MESSAGE'),
});

export const UpdateSingleLight = z.object({
  type: z.literal('UPDATE_LIGHT_BY_SEQUENCE'),
  data: z.object({
    sequenceNumber: z.number().gte(0),
    channel: Channel,
  })
});

export type UpdateSingleLight = z.infer<typeof UpdateSingleLight>;

export const UpdateAllLights = z.object({
  type: z.literal('UPDATE_ALL_LIGHTS'),
  data: z.object({
    channel: Channel,
  })
});

export type UpdateAllLights = z.infer<typeof UpdateAllLights>;

export const InputMessage = z.discriminatedUnion('type', [UpdateSingleLight, UpdateAllLights, EmptyMessage]);

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