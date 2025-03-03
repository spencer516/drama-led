import { XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingDownIcon } from "@heroicons/react/20/solid";

type Props = {
  onClick: () => void;
  label: string;
  iconName: "XMark" | "ArrowTrendingDown";
};

export default function IconButton({ onClick, label, iconName }: Props) {
  const isXMark = iconName === "XMark";

  return (
    <button
      type="button"
      aria-label={label}
      className={`rounded-full ${isXMark ? "bg-red-600" : "bg-purple-600"} p-1 text-white shadow-xs ${isXMark ? "hover:bg-red-500" : "hover:bg-purple-500"} focus-visible:outline-2 focus-visible:outline-offset-2 ${isXMark ? "focus-visible:outline-red-600" : "focus-visible:outline-purple-600"} `}
      onClick={onClick}
    >
      {isXMark ? (
        <XMarkIcon
          aria-hidden="true"
          className="size-3"
        />
      ) : (
        <ArrowTrendingDownIcon
          aria-hidden="true"
          className="size-3"
        />
      )}
    </button>
  );
}
