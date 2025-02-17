"use client";

import LedStatus from "@/components/LedStatus";
import MacroActions from "@/components/MacroActions";
import MessageRenderer from "@/components/MessageRenderer";
import useLEDServerWebSocket from "@/utils/useLEDServerWebSocket";

export default function Home() {
  const { sendMessage, lastMessage, readyState } = useLEDServerWebSocket();
  return (
    <>
      <LedStatus readyState={readyState} />
      <main className="overflow-auto border-b-2 border-slate-300 border-solid relative">
        <MessageRenderer
          message={lastMessage}
          sendMessage={sendMessage}
        />
      </main>
      <div className="overflow-auto">
        <MacroActions sendMessage={sendMessage} />
      </div>
    </>
  );
}
