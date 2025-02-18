"use client";

import Card from "../ui/StatusCard";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import ConnectionStatusToken from "../ui/ConnectionStatusToken";
import { useLatestMessage } from "@/utils/LEDServerContext";

type Params = Readonly<{}>;

export default function MainServerCard({}: Params) {
  const { mainServer } = useLatestMessage();

  return (
    <Card
      title="Main Server"
      actions={<ConnectionStatusToken />}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <GlobeAltIcon className="size-4 text-gray-400" />
          <dd className="text-sm/6 text-gray-900 font-mono">
            {mainServer.sacnIPAddress}
          </dd>
        </div>
      </div>
    </Card>
  );
}
