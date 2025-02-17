export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

type Params = Readonly<{
  status: ConnectionStatus;
}>;

export default function ConnectionStatusToken({ status }: Params) {
  switch (status) {
    case "connected":
      return (
        <div className="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800">
          Connected
        </div>
      );
    case "disconnected":
      return (
        <div className="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium bg-red-100 text-red-800">
          Disconnected
        </div>
      );
    case "reconnecting":
      return (
        <div className="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium bg-yellow-100 text-yellow-800">
          Reconnecting
        </div>
      );
  }
}
