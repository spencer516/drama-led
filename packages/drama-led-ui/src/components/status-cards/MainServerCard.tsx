"use client";

import Card from "../ui/StatusCard";
import ConnectionStatusToken from "../ui/ConnectionStatusToken";

type Params = Readonly<{}>;

export default function MainServerCard({}: Params) {
  return (
    <Card
      title="Main Server"
      actions={<ConnectionStatusToken />}
    >
      Content...
    </Card>
  );
}
