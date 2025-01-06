'use client';

import { SendMessage } from "@/utils/useLEDServerWebSocket";

type Props = {
  sendMessage: SendMessage
};

export default function MacroActions({sendMessage}: Props) {
  return <div>
    <button onClick={() => {
      sendMessage({
        type: 'START_BASIC_CHASE',
        data: {}
      });
    }}>Start Macro</button>
    <button onClick={() => {
      sendMessage({
        type: 'EMPTY_MESSAGE',
      });
    }}>Stop Macro</button>
  </div>
}