import { GledoptoControllerStatus } from "@spencer516/drama-led-messages/src/OutputMessage";
import Card from "../ui/StatusCard";
import { useSendMessage } from "@/utils/LEDServerContext";
import ToggleSwitch from "../ui/ToggleSwitch";
import { GlobeAltIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/16/solid";

type Params = Readonly<{
  gledoptoStatus: GledoptoControllerStatus;
}>;

export default function GledOptoUnitCard({ gledoptoStatus }: Params) {
  const sendMessage = useSendMessage();
  const isEnabled = gledoptoStatus.isSACNEnabled;
  const label = isEnabled ? "Connected" : "Disconnected";

  return (
    <Card
      title="Gledopto Unit"
      subtitle={gledoptoStatus.id}
      actions={
        <ToggleSwitch
          enabled={isEnabled}
          onChange={() => {
            sendMessage({
              type: "UPDATE_OCTO_CONTROLLER",
              data: {
                id: gledoptoStatus.id,
                isSACNEnabled: !isEnabled,
              },
            });
          }}
          disabled={false}
          label={label}
        />
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <GlobeAltIcon className="size-4 text-gray-400" />
          <dd className="text-sm/6 text-gray-900 font-mono">
            {gledoptoStatus.host}&nbsp;({gledoptoStatus.universe})
          </dd>
        </div>
        <div className="flex gap-2 items-center">
          <LightBulbIcon className="size-4 text-gray-400" />
          <dd className="text-sm/6 text-gray-900 font-mono">
            {gledoptoStatus.numberOfLights}
          </dd>
        </div>
        {gledoptoStatus.connectionError == null ? null : (
          <div className="rounded-md bg-red-50 p-2">
            <div className="flex">
              <div className="shrink-0">
                <XCircleIcon
                  aria-hidden="true"
                  className="size-5 text-red-400"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {gledoptoStatus.connectionError}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
