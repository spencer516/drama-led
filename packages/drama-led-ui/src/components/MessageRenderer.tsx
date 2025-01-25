'use client';

import { OutputMessage } from "@spencer516/drama-led-messages/src/OutputMessage";
// import AllLightsSceneRenderer from "./messages/AllLightsSceneRenderer";
import { SendMessage } from "@/utils/useLEDServerWebSocket";
import AllLightsRenderer from "./messages/AllLightsRenderer";

type Props = {
  message: OutputMessage,
  sendMessage: SendMessage
};

export default function MessageRenderer({ message, sendMessage }: Props) {
  switch (message.type) {
    case 'ALL_LIGHTS':
      // return <AllLightsSceneRenderer message={message} sendMessage={sendMessage} />;
      return <AllLightsRenderer message={message} sendMessage={sendMessage} />;
    case 'EMPTY_MESSAGE':
      return <h1>EMPTY_MESSAGE</h1>;
    default:
      return <h1>No Renderer for {message.type}</h1>;
  }
}