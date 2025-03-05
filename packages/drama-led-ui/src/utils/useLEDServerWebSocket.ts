import {
  safeParseOutputMessage,
  OutputMessage,
  InputMessage
} from "@spencer516/drama-led-messages";
import { useCallback, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export type SendMessage = (message: InputMessage) => void;

type ReturnType = {
  sendMessage: SendMessage;
  readyState: ReadyState;
  lastMessage: OutputMessage;
};

export default function useLEDServerWebSocket(): ReturnType {
  const {
    sendJsonMessage,
    lastMessage: lastMessageEvent,
    readyState,
  } = useWebSocket("ws://localhost:8080", {
    shouldReconnect: () => true,
    reconnectInterval: 1000,
  });

  const sendMessage = useCallback(
    (message: InputMessage) => {
      sendJsonMessage(InputMessage.parse(message));
    },
    [sendJsonMessage],
  );

  const lastMessage = useMemo(() => {
    return safeParseOutputMessage(lastMessageEvent?.data ?? "{}");
  }, [lastMessageEvent]);

  return {
    sendMessage,
    readyState,
    lastMessage,
  };
}
