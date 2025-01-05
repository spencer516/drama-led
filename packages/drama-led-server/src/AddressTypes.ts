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

export const ChannelValue = z.number().min(MIN_CHANNEL_VALUE).max(MAX_CHANNEL_VALUE).brand('ChannelValue');
export type ChannelValue = z.infer<typeof ChannelValue>;

export type Address = [
  Universe,
  Channel,
  ChannelValue,
];

export type LightValue = [
  ChannelValue,
  ChannelValue,
  ChannelValue,
];


export const makeUniverse = (data: any) => Universe.parse(data);

export const makeChannel = (data: any) => Channel.parse(data);

export const makeChannelValue = (data: any) => ChannelValue.parse(data);