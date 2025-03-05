import { QLabReceiverStatus } from "@spencer516/drama-led-messages";
import Card from "../ui/StatusCard";
import ToggleSwitch from "../ui/ToggleSwitch";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useSendMessage } from "@/utils/LEDServerContext";
import { XCircleIcon } from "@heroicons/react/16/solid";

type Params = Readonly<{
  qlabReceiverStatus: QLabReceiverStatus;
}>;

export default function QLabReceiverCard({ qlabReceiverStatus }: Params) {
  const sendMessage = useSendMessage();
  const status = qlabReceiverStatus.status;

  return (
    <Card
      title="QLab Receiver"
      actions={
        <ToggleSwitch
          enabled={status === "listening" || status === "starting"}
          onChange={(isEnabled) => {
            sendMessage({
              type: "UPDATE_QLAB_RECEIVER",
              data: {
                isEnabled,
              },
            });
          }}
          disabled={status === "starting"}
          label={status}
        />
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <GlobeAltIcon className="size-4 text-gray-400" />
          <dd className="text-sm/6 text-gray-900 font-mono">
            localhost:{qlabReceiverStatus.port}
          </dd>
        </div>
        {qlabReceiverStatus.connectionError == null ? null : (
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
                  {qlabReceiverStatus.connectionError}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
