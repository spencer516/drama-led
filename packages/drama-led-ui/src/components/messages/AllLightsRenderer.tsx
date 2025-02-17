"use client";

import { SendMessage } from "@/utils/useLEDServerWebSocket";
import { AllLights } from "@spencer516/drama-led-messages/src/OutputMessage";
import { makeRGBValue } from "@spencer516/drama-led-messages/src/AddressTypes";

type Props = {
  message: AllLights;
  sendMessage: SendMessage;
};

export default function AllLightsRenderer({ message, sendMessage }: Props) {
  const lights = message.data.lights;

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">ID</h3>
          </th>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">Universes</h3>
          </th>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">Channel</h3>
          </th>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">Coordinates</h3>
          </th>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">RGB</h3>
          </th>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">Swatch</h3>
          </th>
          <th className="sticky top-0 bg-slate-400 text-left border-2 border-slate-300">
            <h3 className="p-1">Toggle</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        {lights.map((light, sequenceNumber) => {
          const { id, red, green, blue, coordinates } = light;
          const rgbValues = [red.rgbValue, green.rgbValue, blue.rgbValue];
          const channels = [red.channel, green.channel, blue.channel];
          const backgroundColor = `rgb(${rgbValues.join(",")})`;
          const universes = new Set([
            red.universe,
            green.universe,
            blue.universe,
          ]);
          const isOff = rgbValues.every((value) => value === 0);
          const renderedCoords = `${coordinates.x}, ${coordinates.y}`;

          return (
            <tr key={sequenceNumber}>
              <td className="p-1 border-2 border-slate-300 tabular-nums">
                {id}
              </td>
              <td className="p-1 border-2 border-slate-300 tabular-nums">
                {Array.from(universes).join(", ")}
              </td>
              <td className="p-1 border-2 border-slate-300 tabular-nums">
                {channels.map((n) => pad(n, 3)).join(", ")}
              </td>
              <td className="p-1 border-2 border-slate-300 tabular-nums">
                {renderedCoords}
              </td>
              <td className="p-1 border-2 border-slate-300 tabular-nums">
                {rgbValues.map((n) => pad(n, 3)).join(", ")}
              </td>
              <td className="p-1 border-2 border-slate-300">
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor,
                    borderRadius: "100%",
                  }}
                />
              </td>
              <td className="p-1 border-2 border-slate-300">
                <button
                  onClick={() => {
                    sendMessage({
                      type: "UPDATE_LIGHT_BY_ID",
                      data: {
                        id,
                        rgb: {
                          red: makeRGBValue(isOff ? 255 : 0),
                          green: makeRGBValue(isOff ? 255 : 0),
                          blue: makeRGBValue(isOff ? 255 : 0),
                        },
                      },
                    });
                  }}
                >
                  Toggle On/Off
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function pad(num: number, count: number = 3): string {
  return String(num).padStart(count, "0");
}
