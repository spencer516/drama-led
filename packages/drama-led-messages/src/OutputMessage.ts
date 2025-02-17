import { z } from 'zod';
import { LightConfig } from './AddressTypes';

export const OctoControllerStatus = z.object({
  id: z.string(),
  ipAddress: z.string(),
  numberOfLights: z.number(),
  isSACNEnabled: z.boolean(),
});

export type OctoControllerStatus = z.infer<typeof OctoControllerStatus>;

export const System = z.object({
  octos: z.array(OctoControllerStatus),
});

export const LEDServerData = z.object({
  lights: z.array(LightConfig),
  system: System,
});

export type LEDServerData = z.infer<typeof LEDServerData>;

export const OutputMessage = LEDServerData.partial();

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

  return OutputMessage.parse({});
}
