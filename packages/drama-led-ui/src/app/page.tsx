'use client';

import LedStatus from "@/components/LedStatus";
import MacroActions from "@/components/MacroActions";
import MessageRenderer from "@/components/MessageRenderer";
import useLEDServerWebSocket from "@/utils/useLEDServerWebSocket";

export default function Home() {
  const { sendMessage, lastMessage, readyState } = useLEDServerWebSocket();
  return (
    <div className="grid grid-rows-[50px_1fr_100px] h-screen w-screen font-[family-name:var(--font-geist-sans)] bg-white">
      <header className="flex items-center justify-start  px-2 h-40px bg-gray-800 text-white">
        <h1 className="text-2xl flex-grow"><b className="font-bold">Jesuit Drama</b>: LED Media Server</h1>
        <LedStatus readyState={readyState} />
      </header>
      <main className="overflow-auto border-b-2 border-slate-300 border-solid relative">
        <MessageRenderer message={lastMessage} sendMessage={sendMessage} />
      </main>
      <div className="overflow-auto">
        <MacroActions sendMessage={sendMessage} />
      </div>
    </div>
  );
}
