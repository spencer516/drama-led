import { z } from 'zod';
import { Address, LightConfig } from './AddressTypes';

export const AllAddresses = z.object({
  type: z.literal('ALL_ADDRESSES'),
  data: z.object({
    addresses: z.array(Address),
  }),
});

export type AllAddresses = z.infer<typeof AllAddresses>;

export const AllLights = z.object({
  type: z.literal('ALL_LIGHTS'),
  data: z.object({
    lights: z.array(LightConfig),
  }),
});

export type AllLights = z.infer<typeof AllLights>;

export const EmptyMessage = z.object({
  type: z.literal('EMPTY_MESSAGE'),
});

export type EmptyMessage = z.infer<typeof EmptyMessage>;

export const OutputMessage = z.discriminatedUnion('type', [
  AllAddresses,
  AllLights,
  EmptyMessage,
]);

export type OutputMessage = z.infer<typeof OutputMessage>;

export function parseMessage(data: string): OutputMessage {
  const obj = JSON.parse(data);
  return OutputMessage.parse(obj);
}

export function safeParseMessage(data: string): OutputMessage {
  const obj = JSON.parse(data);
  const result = OutputMessage.safeParse(obj);

  if (result.success) {
    return result.data;
  }

  return OutputMessage.parse({ type: 'EMPTY_MESSAGE' });
}
