'use client';

import { SendMessage } from "@/utils/useLEDServerWebSocket";

type Props = {
  sendMessage: SendMessage
};

export default function MacroActions({ sendMessage }: Props) {
  return <div>
    <button className="bg-gray-200 px-2 py-1 m-2 rounded" onClick={() => {
      sendMessage({
        type: 'START_BASIC_CHASE',
        data: {
          spread: 2,
          gap: 10,
          frequencyInSeconds: 20,
          direction: 'forward',
          color: 'rainbow'
        }
      });
    }}>Start Basic Chase</button>
    <button className="bg-gray-200 px-2 py-1 m-2 rounded" onClick={() => {
      sendMessage({
        type: 'START_RADIAL_CHASE',
        data: {}
      });
    }}>Start Radial Chase</button>
    <button className="bg-gray-200 px-2 py-1 m-2 rounded" onClick={() => {
      sendMessage({
        type: 'EMPTY_MESSAGE',
      });
    }}>Stop Macro</button>
  </div>
}