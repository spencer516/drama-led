'use client';

import { SendMessage } from "@/utils/useLEDServerWebSocket";

type Props = {
  sendMessage: SendMessage
};

export default function MacroActions({sendMessage}: Props) {
  return <div>
    <button className="bg-gray-200 px-2 py-1 m-2 rounded" onClick={() => {
      sendMessage({
        type: 'START_BASIC_CHASE',
        data: {}
      });
    }}>Start Macro</button>
    <button className="bg-gray-200 px-2 py-1 m-2 rounded" onClick={() => {
      sendMessage({
        type: 'EMPTY_MESSAGE',
      });
    }}>Stop Macro</button>
  </div>
}