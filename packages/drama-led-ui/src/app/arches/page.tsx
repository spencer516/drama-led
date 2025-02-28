"use client";

import MacroActions from "@/components/MacroActions";
import AllLightsSceneRenderer from "@/components/messages/AllLightsSceneRenderer";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto border-b-2 border-slate-300 border-solid relative grow">
        <AllLightsSceneRenderer />
      </div>
      <div className="overflow-auto grow-0 shrink-0">
        <MacroActions />
      </div>
    </div>
  );
}
