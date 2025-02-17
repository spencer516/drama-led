import { useServerReadyState } from "@/utils/LEDServerContext";
import { ReadyState } from "react-use-websocket";

type Params = Readonly<{}>;

export default function ConnectionStatusToken({}: Params) {
  const status = useServerReadyState();

  switch (status) {
    case ReadyState.UNINSTANTIATED:
      return (
        <StatusTokenBase className="bg-gray-100 text-gray-800">
          Not Started
        </StatusTokenBase>
      );
    case ReadyState.CONNECTING:
      return (
        <StatusTokenBase className="bg-yellow-100 text-yellow-800">
          Connecting...
        </StatusTokenBase>
      );
    case ReadyState.OPEN:
      return (
        <StatusTokenBase className="bg-green-100 text-green-800">
          Connected
        </StatusTokenBase>
      );
    case ReadyState.CLOSING:
      return (
        <StatusTokenBase className="bg-yellow-100 text-yellow-800">
          Closing...
        </StatusTokenBase>
      );
    case ReadyState.CLOSED:
      return (
        <StatusTokenBase className="bg-red-100 text-red-800">
          Closed
        </StatusTokenBase>
      );
  }
}

type BaseParams = Readonly<{
  children: React.ReactNode;
  className: string;
}>;

function StatusTokenBase({ children, className }: BaseParams) {
  return (
    <div
      className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium ${className}`}
    >
      {children}
    </div>
  );
}
