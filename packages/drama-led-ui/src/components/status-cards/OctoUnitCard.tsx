"use client";

import { useState } from "react";
import Card from "../ui/StatusCard";
import ToggleSwitch from "../ui/ToggleSwitch";

type Params = Readonly<{
  title: string;
}>;

export default function OctoUnitCard({ title }: Params) {
  const [isEnabled, setIsEnabled] = useState(false);
  const label = isEnabled ? "Connected" : "Disconnected";

  return (
    <Card
      title={title}
      actions={
        <ToggleSwitch
          enabled={isEnabled}
          onChange={setIsEnabled}
          disabled={false}
          label={label}
        />
      }
    >
      Content...
    </Card>
  );
}
