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
              id: "single-light-chase",
              spread: 1,
              gap: 10,
              maxFPS: 10,
              direction: "forward",
              color: "white",
              controllerID: "spoonful_of_circuit:1",
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
              id: "chase-with-spread",
              spread: 5,
              gap: 15,
              maxFPS: 20,
              direction: "reverse",
              color: "red",
              controllerID: "supercalifragilisticexpealidigital:1",
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
              controllerID: "berts_brights:1",
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
              // controllerID: "berts_brights",
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
