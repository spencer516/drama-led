'use client';

import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function LedStatus() {
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8080');
  const [sequenceNum, setSequenceNum] = useState(-1);

  const increment = () => {
    const newSequenceNum = sequenceNum + 1;
    setSequenceNum(newSequenceNum);
    sendMessage(JSON.stringify({
      type: 'UPDATE_LIGHT_BY_SEQUENCE',
      data: {
        sequenceNumber: newSequenceNum,
        channel: {
          red: 100,
          green: 100,
          blue: 100,
        }
      }
    }))
  };

  switch (readyState) {
    case ReadyState.UNINSTANTIATED:
      return <h1>Web Socket not started</h1>;
    case ReadyState.CONNECTING:
      return <h1>Connecting...</h1>;
    case ReadyState.OPEN:
      return <>
        <h1>{lastMessage?.data ?? 'unknown message'}</h1>
        <button onClick={increment}>
          Turn On {sequenceNum + 1}
        </button>
      </>;
    case ReadyState.CLOSING:
      return <h1>Closing...</h1>;
    case ReadyState.CLOSED:
      return <h1>Closed.</h1>;
  }
}