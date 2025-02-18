import { z } from 'zod';
import { LightConfig, Universe } from './AddressTypes';

export const OctoControllerStatus = z.object({
  id: z.string(),
  ipAddress: z.string(),
  numberOfLights: z.number(),
  numberOfLightsOn: z.number(),
  isSACNEnabled: z.boolean(),
  connectionError: z.string().nullable(),
  universeRange: z.tuple([Universe, Universe]),
});

export type OctoControllerStatus = z.infer<typeof OctoControllerStatus>;

export const GledoptoControllerStatus = z.object({
  id: z.string(),
  host: z.string(),
  numberOfLights: z.number(),
  numberOfLightsOn: z.number(),
  isSACNEnabled: z.boolean(),
  connectionError: z.string().nullable(),
  universe: Universe,
});

export type GledoptoControllerStatus = z.infer<typeof GledoptoControllerStatus>;

export const MainServerStatus = z.object({
  sacnIPAddress: z.string().nullable(),
});

export type MainServerStatus = z.infer<typeof MainServerStatus>;

export const System = z.object({
  octos: z.array(OctoControllerStatus),
  gledoptos: z.array(GledoptoControllerStatus),
  mainServer: MainServerStatus,
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
