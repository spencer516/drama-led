'use client';

import { ReadyState } from 'react-use-websocket';

type Props = {
  readyState: ReadyState;
};

type IconColor = "red" | "green" | "yellow";

function getTextForState(readyState: ReadyState) {
  switch (readyState) {
    case ReadyState.UNINSTANTIATED:
      return "not started";
    case ReadyState.CONNECTING:
      return "connecting...";
    case ReadyState.OPEN:
      return "connected";
    case ReadyState.CLOSING:
      return "closing...";
    case ReadyState.CLOSED:
      return "closed";
  }
}

function getIconColorForState(readyState: ReadyState): IconColor {
  switch (readyState) {
    case ReadyState.UNINSTANTIATED:
    case ReadyState.CONNECTING:
    case ReadyState.CLOSING:
      return "yellow";
    case ReadyState.OPEN:
      return "green";
    case ReadyState.CLOSED:
      return "red";
  }
}

export default function LedStatus({ readyState }: Props) {
  return <div className="flex gap-2 items-center">
    <p className="text-sm text-slate-400">{getTextForState(readyState)}</p>
    <div
      data-color={getIconColorForState(readyState)}
      className="rounded-full w-4 h-4 bg-slate-400 data-[color=red]:bg-red-600 data-[color=yellow]:bg-yellow-600 data-[color=green]:bg-green-600 ">
    </div>
  </div>;
}