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

export const Address = z.tuple([Universe, Channel, ChannelValue]);
export type Address = z.infer<typeof Address>;

export const LightValue = z.tuple([ChannelValue, ChannelValue, ChannelValue]);
export type LightValue = z.infer<typeof LightValue>;

export const LightConfig = z.object({
  universe: Universe,
  rgbChannels: z.tuple([Channel, Channel, Channel]),
  red: ChannelValue,
  green: ChannelValue,
  blue: ChannelValue,
});

export type LightConfig = z.infer<typeof LightConfig>;


export const makeUniverse = (data: any) => Universe.parse(data);

export const makeChannel = (data: any) => Channel.parse(data);

export const makeChannelValue = (data: number) => ChannelValue.parse(Math.round(data));