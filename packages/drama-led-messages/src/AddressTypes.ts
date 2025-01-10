import { z } from 'zod';

export const MIN_UNIVERSE = 1;
export const MAX_UNIVERSE = 63999;

export const Universe = z.number().min(MIN_UNIVERSE).max(MAX_UNIVERSE).brand('Universe');
export type Universe = z.infer<typeof Universe>;

export const MIN_CHANNEL = 1;
export const MAX_CHANNEL = 512;

export const Channel = z.number().min(MIN_CHANNEL).max(MAX_CHANNEL).brand('Channel');
export type Channel = z.infer<typeof Channel>;

export const MIN_CHANNEL_VALUE = 0;
export const MAX_CHANNEL_VALUE = 100;

export const ChannelValue = z.number().min(MIN_CHANNEL_VALUE).max(MAX_CHANNEL_VALUE).int().brand('ChannelValue');
export type ChannelValue = z.infer<typeof ChannelValue>;

export const MIN_RGB_VALUE = 0;
export const MAX_RGB_VALUE = 255;

export const RGBValue = z.number().min(MIN_RGB_VALUE).max(MAX_RGB_VALUE).int().brand('RGBValue');
export type RGBValue = z.infer<typeof RGBValue>;

export const LightID = z.string().brand('LightID');
export type LightID = z.infer<typeof LightID>;

export const LightCoordinates = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
});

export type LightCoordinates = z.infer<typeof LightCoordinates>;

export const Address = z.tuple([Universe, Channel, ChannelValue]);
export type Address = z.infer<typeof Address>;

export const LightValue = z.tuple([ChannelValue, ChannelValue, ChannelValue]);
export type LightValue = z.infer<typeof LightValue>;

export const UniverseChannel = z.tuple([Universe, Channel]);
export type UniverseChannel = z.infer<typeof UniverseChannel>;

export const LightChannelConfig = z.object({
  universe: Universe,
  channel: Channel,
  value: ChannelValue,
  rgbValue: RGBValue,
});

export type LightChannelConfig = z.infer<typeof LightChannelConfig>;

export const LightConfig = z.object({
  id: LightID,
  coordinates: LightCoordinates,
  red: LightChannelConfig,
  green: LightChannelConfig,
  blue: LightChannelConfig,
});

export type LightConfig = z.infer<typeof LightConfig>;

export const makeUniverse = (data: number) => Universe.parse(data);

export const makeChannel = (data: number) => Channel.parse(data);

export const makeChannelValue = (data: number) => ChannelValue.parse(Math.round(data));

export const makeLightID = (data: string) => LightID.parse(data);

export const makeRGBValue = (data: number) => RGBValue.parse(data);
