"use client";

import dynamic from "next/dynamic";
import { useSendMessage } from "@/utils/LEDServerContext";
import { useState } from "react";
import { InputMessage } from "@spencer516/drama-led-messages/src/InputMessage";
import { MACRO_EXAMPLES } from "@spencer516/drama-led-messages/src/macros/AllMacros";
import ErrorModal from "./ui/ErrorModal";

const JSONEditor = dynamic(() => import("./ui/JSONEditor"), { ssr: false });

type Props = {};

type ButtonProps = {
  onClick: () => void;
  label: string;
};

function Button({ onClick, label }: ButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function simplifyError(errorObject: unknown): unknown {
  if (typeof errorObject === "object") {
    const result: any = {};

    // @ts-ignore
    for (const [key, value] of Object.entries(errorObject)) {
      if (key === "_errors") {
        if (Array.isArray(value) && value.length > 0) {
          result.errors = value;
        }
      } else {
        result[key] = simplifyError(value);
      }
    }

    return result;
  } else {
    return errorObject;
  }
}

export default function MacroActions({}: Props) {
  const sendMessage = useSendMessage();
  const [code, setCode] = useState("{}");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const sendWithValidation = () => {
    try {
      const result = InputMessage.safeParse(JSON.parse(code));

      if (result.success) {
        setError(null);
        sendMessage(result.data);
      } else {
        setIsModalOpen(true);
        setError(JSON.stringify(simplifyError(result.error.format()), null, 2));
      }
    } catch (e) {
      setIsModalOpen(true);
      setError(String(e));
    }
  };

  const setCodeObject = (object: InputMessage) => {
    setCode(JSON.stringify(object, null, 2));
  };
  return (
    <>
      <div className="flex gap-4 p-4 box-border">
        <div className="grow-0 flex flex-col gap-2">
          {Object.entries(MACRO_EXAMPLES).map(([label, example]) => (
            <Button
              key={label}
              label={label}
              onClick={() => setCodeObject(example)}
            />
          ))}
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
            className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              sendWithValidation();
            }}
          >
            Submit
          </button>
          <span className="isolate inline-flex rounded-md shadow-xs">
            <button
              type="button"
              className="rounded-l-md grow bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
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
              type="button"
              className="rounded-r-md grow bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onClick={() => {
                sendMessage({
                  type: "TURN_ALL_OFF",
                  data: {},
                });
              }}
            >
              All Off
            </button>
          </span>
        </div>
      </div>
      <ErrorModal
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
        error={error ?? ""}
      />
    </>
  );
}
