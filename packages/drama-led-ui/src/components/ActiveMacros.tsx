"use client";

import { useLatestMessage, useSendMessage } from "@/utils/LEDServerContext";
import { ArrowTrendingDownIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingUpIcon } from "@heroicons/react/20/solid";
import Card from "./ui/StatusCard";
import IconButton from "./ui/IconButton";
import {
  BuildingOfficeIcon,
  ClockIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

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
          actions={
            <div className="flex gap-1">
              {macro.hasFadeOut ? (
                <IconButton
                  label="Fade Out Macro"
                  iconName="ArrowTrendingDown"
                  onClick={() => {
                    sendMessage({
                      type: "FADE_OUT_MACRO",
                      cueID: macro.cueID,
                    });
                  }}
                />
              ) : null}
              <IconButton
                label="Stop Macro"
                iconName="XMark"
                onClick={() => {
                  sendMessage({
                    type: "STOP_MACRO",
                    cueID: macro.cueID,
                  });
                }}
              />
            </div>
          }
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <IdentificationIcon className="size-4 text-gray-400" />
              <dd className="text-sm/6 text-gray-900 font-mono">
                {macro.cueID}
              </dd>
            </div>
            <div className="flex gap-2 items-center">
              <BuildingOfficeIcon className="size-4 text-gray-400" />
              <dd className="text-sm/6 text-gray-900 font-mono">
                {macro.segment}
              </dd>
            </div>
            {macro.percentComplete == null ? null : (
              <div className="flex gap-2 items-center">
                <ClockIcon className="size-4 text-gray-400" />
                <div className="overflow-hidden rounded-full bg-gray-200 grow shrink-0 h-2">
                  <div
                    style={{ width: `${macro.percentComplete * 100}%` }}
                    className="h-2 rounded-full bg-indigo-600 transition-[width]"
                  />
                </div>
              </div>
            )}
            {macro.activeTransition == null ? null : (
              <div className="flex gap-2 items-center">
                {macro.activeTransition.transitionName === "FadeIn" ? (
                  <ArrowTrendingUpIcon className="size-4 text-gray-400" />
                ) : (
                  <ArrowTrendingDownIcon className="size-4 text-gray-400" />
                )}
                <div className="overflow-hidden rounded-full bg-gray-200 grow shrink-0 h-2">
                  <div
                    style={{
                      width: `${macro.activeTransition.percentComplete * 100}%`,
                      opacity:
                        macro.activeTransition.transitionName === "FadeIn"
                          ? macro.activeTransition.percentComplete
                          : 1 - macro.activeTransition.percentComplete,
                    }}
                    className="h-2 rounded-full bg-green-600 transition-[width]"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      {activeMacros.length === 0 ? (
        <div className="text-gray-500 block rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
          No Active Macros
        </div>
      ) : (
        <button
          type="button"
          className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
          onClick={() => {
            sendMessage({
              type: "STOP_ALL_MACROS",
            });
          }}
        >
          Stop All Macros
        </button>
      )}
    </div>
  );
}
