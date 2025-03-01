"use client";

import { useLatestMessage, useSendMessage } from "@/utils/LEDServerContext";
import Card from "./ui/StatusCard";
import IconButton from "./ui/IconButton";

type Props = {};

export default function ActiveMacroActions({}: Props) {
  const { activeMacros } = useLatestMessage();
  const sendMessage = useSendMessage();

  return (
    <div className="flex flex-col gap-4 shrink-0 w-[300px] border-r border-slate-300 p-4 justify-start justify-items-start">
      <h3 className="text-xl font-semibold text-gray-900">Active Macros</h3>
      {activeMacros.map((macro) => (
        <Card
          key={macro.cueID}
          className="grow-0 w-auto"
          title={macro.macroName}
          subtitle={macro.cueID}
          actions={
            <IconButton
              label="Stop Macro"
              onClick={() => {
                sendMessage({
                  type: "STOP_MACRO",
                  cueID: macro.cueID,
                });
              }}
            />
          }
        />
      ))}

      {activeMacros.length === 0 ? (
        <div className="text-gray-500 block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
          No Active Macros
        </div>
      ) : null}
    </div>
  );
}
