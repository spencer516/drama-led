"use client";

import { useSendMessage } from "@/utils/LEDServerContext";
import { makeRGBValue } from "@spencer516/drama-led-messages/src/AddressTypes";
import { useState } from "react";
import JSONEditor from "./ui/JSONEditor";
import { InputMessage } from "@spencer516/drama-led-messages/src/InputMessage";

type Props = {};

type ButtonProps = {
  onClick: () => void;
  label: string;
};

function Button({ onClick, label }: ButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function MacroActions({}: Props) {
  const sendMessage = useSendMessage();
  const [code, setCode] = useState("{}");
  const setCodeObject = (object: any) => {
    setCode(JSON.stringify(object, null, 2));
  };
  return (
    <div className="flex gap-4 p-4 box-border">
      <div className="grow-0 flex flex-col gap-2">
        <Button
          label="All On"
          onClick={() =>
            setCodeObject({
              type: "TURN_ALL_ON",
              data: {},
            })
          }
        />
        <Button
          label="All Off"
          onClick={() =>
            setCodeObject({
              type: "TURN_ALL_OFF",
              data: {},
            })
          }
        />
        <Button
          label="Basic Chase"
          onClick={() =>
            setCodeObject({
              type: "START_BASIC_CHASE",
              data: {
                id: "cue1",
                segment: "ALL_ARCHES_FULL",
                spread: 5,
                gap: 15,
                maxFPS: 20,
                direction: "reverse",
                color: "red",
              },
            })
          }
        />
        <Button
          label="Rainbow Chase"
          onClick={() =>
            setCodeObject({
              type: "START_BASIC_CHASE",
              data: {
                id: "cue1",
                segment: "ALL_ARCHES_FULL",
                spread: 5,
                gap: 15,
                maxFPS: 10,
                direction: "reverse",
                color: "rainbow",
              },
            })
          }
        />
        <Button
          label="Shimmer"
          onClick={() =>
            setCodeObject({
              type: "START_SHIMMER",
              cueID: "shimmer-1",
              segment: "FULL_ARCH_STAGE_LEFT",
              data: {
                speed: 40,
                density: 20,
                color: {
                  red: 255,
                  green: 251,
                  blue: 212,
                },
              },
            })
          }
        />
        <Button
          label="Sparkle"
          onClick={() =>
            setCodeObject({
              type: "START_RANDOM_SPARKLE",
              data: {
                segment: "ALL_ARCHES_INNER",
              },
            })
          }
        />
      </div>
      <div className="border-slate-300 border grow h-[400px]">
        <JSONEditor
          code={code}
          onChange={setCode}
        />
      </div>
      <div className="flex flex-col grow-0 gap-2 w-[150px]">
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            sendMessage(InputMessage.parse(JSON.parse(code)));
          }}
        >
          Submit
        </button>
        <button
          type="button"
          className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={() => {
            sendMessage({
              type: "TURN_ALL_OFF",
              data: {},
            });
          }}
        >
          All Off
        </button>
      </div>
    </div>
  );
}
