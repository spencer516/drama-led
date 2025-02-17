"use client";

import MacroActions from "@/components/MacroActions";
import AllLightsSceneRenderer from "@/components/messages/AllLightsSceneRenderer";

export default function Home() {
  return (
    <>
      <main className="overflow-auto border-b-2 border-slate-300 border-solid relative">
        <AllLightsSceneRenderer />
      </main>
      <div className="overflow-auto">
        <MacroActions />
      </div>
    </>
  );
}
