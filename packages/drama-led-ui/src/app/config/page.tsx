import GledOptoUnitCard from "@/components/status-cards/GledOptoUnitCard";
import MainServerCard from "@/components/status-cards/MainServerCard";
import OctoUnitCard from "@/components/status-cards/OctoUnitCard";
import QLabReceiverCard from "@/components/status-cards/QLabReceiverCard";

export default function ConfigPage() {
  return (
    <div className="flex flex-wrap gap-4 m-4">
      <MainServerCard />
      <OctoUnitCard title="Octo Unit 1" />
      <OctoUnitCard title="Octo Unit 2" />
      <OctoUnitCard title="Octo Unit 3" />
      <GledOptoUnitCard title="GledOpto Unit 1" />
      <GledOptoUnitCard title="GledOpto Unit 2" />
      <QLabReceiverCard />
    </div>
  );
}
