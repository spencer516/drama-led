"use client";

import { useState } from "react";
import Card from "../ui/StatusCard";
import ConnectionStatusToken, {
  ConnectionStatus,
} from "../ui/ConnectionStatusToken";

type Params = Readonly<{}>;

export default function MainServerCard({}: Params) {
  const [status, setStatus] = useState<ConnectionStatus>("reconnecting");

  return (
    <Card
      title="Main Server"
      actions={<ConnectionStatusToken status={status} />}
    >
      Content...
    </Card>
  );
}
