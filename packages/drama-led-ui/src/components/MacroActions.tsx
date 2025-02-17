"use client";

import { useSendMessage } from "@/utils/LEDServerContext";

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
              spread: 1,
              gap: 10,
              frequencyInSeconds: 10,
              direction: "forward",
              color: "white",
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
            type: "START_BASIC_CHASE",
            data: {
              spread: 5,
              gap: 15,
              frequencyInSeconds: 20,
              direction: "reverse",
              color: "yellow",
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
              spread: 5,
              gap: 15,
              frequencyInSeconds: 10,
              direction: "forward",
              color: "rainbow",
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
            data: {},
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
