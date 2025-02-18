"use client";

import GledOptoUnitCard from "@/components/status-cards/GledOptoUnitCard";
import MainServerCard from "@/components/status-cards/MainServerCard";
import OctoUnitCard from "@/components/status-cards/OctoUnitCard";
import QLabReceiverCard from "@/components/status-cards/QLabReceiverCard";
import { useLatestMessage } from "@/utils/LEDServerContext";

export default function ConfigPage() {
  const system = useLatestMessage();

  return (
    <div className="flex flex-wrap gap-4 m-4">
      <MainServerCard />
      {system.octos.map((octo) => (
        <OctoUnitCard
          key={octo.id}
          octoStatus={octo}
        />
      ))}
      {system.gledoptos.map((gledopto) => (
        <GledOptoUnitCard
          key={gledopto.id}
          gledoptoStatus={gledopto}
        />
      ))}
      <QLabReceiverCard qlabReceiverStatus={system.qlabStatus} />
    </div>
  );
}
