'use client';

import { SendMessage } from "@/utils/useLEDServerWebSocket";
import {AllLights} from "@spencer516/drama-led-messages/src/OutputMessage";
import { makeChannelValue } from '@spencer516/drama-led-messages/src/AddressTypes';

type Props = {
  message: AllLights,
  sendMessage: SendMessage
};

export default function AllLightsRenderer({message, sendMessage}: Props) {
  const lights = message.data.lights;

  return <table className="table-auto">
    <thead>
      <tr>
        <th className="m-6">Sequence Number</th>
        <th className="m-6">Universe</th>
        <th className="m-6">Channel</th>
        <th className="m-6">Red</th>
        <th className="m-6">Green</th>
        <th className="m-6">Blue</th>
        <th className="m-6">Swatch</th>
        <th className="m-6">Toggle</th>
      </tr>
    </thead>
    <tbody>
      {lights.map((light, sequenceNumber) => {
        const {universe, rgbChannels, red, green, blue} = light;
        const backgroundColor = `#${percentToHex(red)}${percentToHex(green)}${percentToHex(blue)}`;

        return <tr key={sequenceNumber}>
          <td>{sequenceNumber}</td>
          <td>{universe}</td>
          <td>{rgbChannels.join(', ')}</td>
          <td>{red}</td>
          <td>{green}</td>
          <td>{blue}</td>
          <td>
            <div style={{
              width: '15px',
              height: '15px',
              backgroundColor,
              borderRadius: '100%',
            }} />
          </td>
          <td>
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

function percentToHex(percent: number): string {
  const hex = Math.floor(percent / 100 * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}