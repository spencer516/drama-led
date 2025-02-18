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
  const status = gledoptoStatus.sacnStatus;

  return (
    <Card
      title="Gledopto Unit"
      subtitle={gledoptoStatus.id}
      actions={
        <ToggleSwitch
          enabled={status === "connected" || status === "connecting"}
          onChange={(isSACNEnabled) => {
            sendMessage({
              type: "UPDATE_CONTROLLER",
              data: {
                id: gledoptoStatus.id,
                isSACNEnabled,
              },
            });
          }}
          disabled={status === "connecting"}
          label={status}
        />
      }
      footer={
        status === "connected" ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
              onClick={() => {
                sendMessage({
                  type: "START_RANDOM_SPARKLE",
                  data: {
                    controllerID: gledoptoStatus.id,
                  },
                });
              }}
            >
              All On
            </button>
            <button
              type="button"
              className="rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
              onClick={() => {
                sendMessage({
                  type: "TURN_ALL_OFF",
                  data: {
                    controllerID: gledoptoStatus.id,
                  },
                });
              }}
            >
              All Off
            </button>
          </div>
        ) : null
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
            {gledoptoStatus.numberOfLightsOn}&nbsp;/&nbsp;
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
