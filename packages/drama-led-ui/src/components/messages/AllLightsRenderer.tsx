'use client';

import { SendMessage } from "@/utils/useLEDServerWebSocket";
import { AllLights } from "@spencer516/drama-led-messages/src/OutputMessage";
import { makeChannelValue } from '@spencer516/drama-led-messages/src/AddressTypes';

type Props = {
  message: AllLights,
  sendMessage: SendMessage
};

export default function AllLightsRenderer({ message, sendMessage }: Props) {
  const lights = message.data.lights;

  return <table className="table-auto w-full">
    <thead>
      <tr>
        <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300"><h3 className="p-1">Sequence Number</h3></th>
        <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300"><h3 className="p-1">Universe</h3></th>
        <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300"><h3 className="p-1">Channel</h3></th>
        <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300"><h3 className="p-1">RGB</h3></th>
        <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300"><h3 className="p-1">Swatch</h3></th>
        <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300"><h3 className="p-1">Toggle</h3></th>
      </tr>
    </thead>
    <tbody>
      {lights.map((light, sequenceNumber) => {
        const { universe, rgbChannels, red, green, blue } = light;
        const backgroundColor = `#${percentToHex(red)}${percentToHex(green)}${percentToHex(blue)}`;

        return <tr key={sequenceNumber}>
          <td className="p-1 border-2 border-slate-300 tabular-nums">{pad(sequenceNumber)}</td>
          <td className="p-1 border-2 border-slate-300 tabular-nums">{pad(universe, 5)}</td>
          <td className="p-1 border-2 border-slate-300 tabular-nums">{rgbChannels.map(pad).join(', ')}</td>
          <td className="p-1 border-2 border-slate-300 tabular-nums">{pad(red)},{pad(green)},{pad(blue)}</td>
          <td className="p-1 border-2 border-slate-300">
            <div style={{
              width: '15px',
              height: '15px',
              backgroundColor,
              borderRadius: '100%',
            }} />
          </td>
          <td className="p-1 border-2 border-slate-300">
            <button onClick={() => {
              sendMessage({
                type: 'UPDATE_LIGHT_BY_SEQUENCE',
                data: {
                  sequenceNumber,
                  channel: {
                    red: makeChannelValue(red === 0 ? 100 : 0),
                    green: makeChannelValue(green === 0 ? 100 : 0),
                    blue: makeChannelValue(blue === 0 ? 100 : 0),
                  }
                }
              });
            }}>Toggle On/Off</button>
          </td>
        </tr>;
      })}
    </tbody>
  </table>
}

function pad(num: number, count: number = 3): string {
  return String(num).padStart(count, '0');
}

function percentToHex(percent: number): string {
  const hex = Math.floor(percent / 100 * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}