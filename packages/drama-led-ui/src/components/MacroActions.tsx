"use client";

import { useSendMessage } from "@/utils/LEDServerContext";
import { makeRGBValue } from "@spencer516/drama-led-messages/src/AddressTypes";

type Props = {};

export default function MacroActions({}: Props) {
  const sendMessage = useSendMessage();
  return (
    <div>
      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "TURN_ALL_ON",
            data: {},
          });
        }}
      >
        All On
      </button>
      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "TURN_ALL_OFF",
            data: {},
          });
        }}
      >
        All Off
      </button>
      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "START_BASIC_CHASE",
            data: {
              id: "single-light-chase",
              spread: 1,
              gap: 10,
              maxFPS: 10,
              direction: "forward",
              color: "white",
              segment: "FULL_ARCH_STAGE_LEFT",
            },
          });
        }}
      >
        Single Light Chase
      </button>
      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "START_SHIMMER",
            cueID: "shimmer-1",
            segment: "FULL_ARCH_STAGE_LEFT",

            data: {
              speed: 40,
              density: 20,
              color: {
                red: makeRGBValue(255),
                green: makeRGBValue(251),
                blue: makeRGBValue(212),
              },
            },
          });
        }}
      >
        Shimmer
      </button>
      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "START_BASIC_CHASE",
            data: {
              id: "chase-with-spread",
              spread: 5,
              gap: 15,
              maxFPS: 20,
              direction: "reverse",
              color: "red",
              segment: "FULL_ARCH_CENTER",
            },
          });
        }}
      >
        Chase with Spread
      </button>

      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "START_BASIC_CHASE",
            data: {
              id: "rainbow-chase",
              spread: 5,
              gap: 15,
              maxFPS: 10,
              direction: "forward",
              color: "rainbow",
              segment: "FULL_ARCH_STAGE_RIGHT",
            },
          });
        }}
      >
        Rainbow Chase
      </button>

      <button
        className="bg-gray-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "START_RANDOM_SPARKLE",
            data: {
              segment: "ALL_ARCHES_INNER",
            },
          });
        }}
      >
        Start Sparkle
      </button>
      <button
        className="bg-red-200 px-2 py-1 m-2 rounded"
        onClick={() => {
          sendMessage({
            type: "EMPTY_MESSAGE",
          });
        }}
      >
        Stop
      </button>
    </div>
  );
}
