"use client";

import { InputMessage } from "@spencer516/drama-led-messages/src/InputMessage";
import {
  safeParseMessage,
  LEDServerData,
} from "@spencer516/drama-led-messages/src/OutputMessage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

type SendMessage = (message: InputMessage) => void;

type LEDServerContextType = {
  sendMessage: SendMessage;
  readyState: ReadyState;
  lastMessage: LEDServerData;
};

const DEFAULT_SERVER_CONTENT = LEDServerData.parse({
  lights: [],
  octos: [],
  gledoptos: [],
  mainServer: {
    sacnIPAddress: null,
  },
  qlabStatus: {
    port: 0,
    status: "stopped",
    connectionError: null,
  },
});

const LEDServerContext = createContext<LEDServerContextType>({
  lastMessage: DEFAULT_SERVER_CONTENT,
  readyState: ReadyState.UNINSTANTIATED,
  sendMessage: () => {},
});

export function LEDServerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lastMessage, setLastMessage] = useState<LEDServerData>(
    DEFAULT_SERVER_CONTENT,
  );

  const { sendJsonMessage, readyState } = useWebSocket("ws://localhost:8080", {
    shouldReconnect: () => true,
    reconnectInterval: 1000,
    onMessage: (event) => {
      const message = safeParseMessage(event.data);
      setLastMessage((prevMessage) => {
        return {
          ...prevMessage,
          ...message,
        };
      });
    },
  });

  const sendMessage = useCallback(
    (message: InputMessage) => {
      sendJsonMessage(InputMessage.parse(message));
    },
    [sendJsonMessage],
  );

  const context = useMemo(
    () => ({
      sendMessage,
      readyState,
      lastMessage,
    }),
    [sendMessage, readyState, lastMessage],
  );

  return (
    <LEDServerContext.Provider value={context}>
      {children}
    </LEDServerContext.Provider>
  );
}

export function useServerReadyState() {
  const { readyState } = useContext(LEDServerContext);

  return readyState;
}

export function useLatestMessage() {
  const { lastMessage } = useContext(LEDServerContext);

  return lastMessage;
}

export function useSendMessage() {
  const { sendMessage } = useContext(LEDServerContext);

  return sendMessage;
}
