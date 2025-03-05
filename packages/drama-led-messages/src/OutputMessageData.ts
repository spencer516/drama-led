import { z } from 'zod';
import { LightConfig, Universe } from './AddressTypes';
import { NamedLEDSection } from './NamedLEDSection';

export const QLabReceiverConnectionStatus = z.enum([
  'starting',
  'listening',
  'stopped',
]);

export type QLabReceiverConnectionStatus = z.infer<
  typeof QLabReceiverConnectionStatus
>;

export const QLabReceiverStatus = z.object({
  port: z.number(),
  status: QLabReceiverConnectionStatus,
  connectionError: z.string().nullable(),
});

export type QLabReceiverStatus = z.infer<typeof QLabReceiverStatus>;

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

export const GledoptoSACNStatus = z.enum([
  'connecting',
  'connected',
  'disconnected',
]);

export type GledoptoSACNStatus = z.infer<typeof GledoptoSACNStatus>;

export const GledoptoControllerStatus = z.object({
  id: z.string(),
  host: z.string(),
  numberOfLights: z.number(),
  numberOfLightsOn: z.number(),
  sacnStatus: GledoptoSACNStatus,
  connectionError: z.string().nullable(),
  universe: Universe,
});

export type GledoptoControllerStatus = z.infer<typeof GledoptoControllerStatus>;

export const MainServerStatus = z.object({
  sacnIPAddress: z.string().nullable(),
});

export type MainServerStatus = z.infer<typeof MainServerStatus>;

export const MacroStatus = z.object({
  cueID: z.string(),
  macroName: z.string(),
  segment: NamedLEDSection,
  hasFadeOut: z.boolean(),
  percentComplete: z.number().optional(),
  activeTransition: z
    .object({
      percentComplete: z.number().min(0).max(1),
      transitionName: z.string(),
    })
    .optional(),
});

export type MacroStatus = z.infer<typeof MacroStatus>;

export const LEDServerData = z.object({
  lights: z.array(LightConfig),
  octos: z.array(OctoControllerStatus),
  gledoptos: z.array(GledoptoControllerStatus),
  mainServer: MainServerStatus,
  qlabStatus: QLabReceiverStatus,
  activeMacros: z.array(MacroStatus),
});

export type LEDServerData = z.infer<typeof LEDServerData>;

export const OutputMessage = LEDServerData.partial();

export type OutputMessage = z.infer<typeof OutputMessage>;

export function parseOutputMessage(data: string): OutputMessage {
  const obj = JSON.parse(data);
  return OutputMessage.parse(obj);
}

export function safeParseOutputMessage(data: string): OutputMessage {
  const obj = JSON.parse(data);
  const result = OutputMessage.safeParse(obj);

  if (result.success) {
    return result.data;
  }

  return OutputMessage.parse({});
}
