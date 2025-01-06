'use client';

import { ReadyState } from 'react-use-websocket';

type Props = {
  readyState: ReadyState;
};

export default function LedStatus({readyState}: Props) {
  switch (readyState) {
    case ReadyState.UNINSTANTIATED:
      return <h1>Web Socket not started</h1>;
    case ReadyState.CONNECTING:
      return <h1>Connecting...</h1>;
    case ReadyState.OPEN:
      return <h1>Connected.</h1>;
    case ReadyState.CLOSING:
      return <h1>Closing...</h1>;
    case ReadyState.CLOSED:
      return <h1>Closed.</h1>;
  }
}