import { z } from 'zod';
import { ChannelValue } from './AddressTypes';

const Channel = z.object({
  red: ChannelValue,
  green: ChannelValue,
  blue: ChannelValue,
});

type Channel = z.infer<typeof Channel>;

const UpdateSingleLight = z.object({
  type: z.literal('UPDATE_LIGHT_BY_SEQUENCE'),
  data: z.object({
    sequenceNumber: z.number().gte(0),
    channel: Channel,
  })
});

type UpdateSingleLight = z.infer<typeof UpdateSingleLight>;

const UpdateAllLights = z.object({
  type: z.literal('UPDATE_ALL_LIGHTS'),
  data: z.object({
    channel: Channel,
  })
});

type UpdateAllLights = z.infer<typeof UpdateAllLights>;

const InputMessage = z.discriminatedUnion('type', [UpdateSingleLight, UpdateAllLights]);

type InputMessage = z.infer<typeof InputMessage>;

function parseMessage(data: string): InputMessage {
  const obj = JSON.parse(data);
  console.log('Received Message', obj);
  return InputMessage.parse(obj);
}

export { InputMessage, parseMessage, UpdateSingleLight, UpdateAllLights };