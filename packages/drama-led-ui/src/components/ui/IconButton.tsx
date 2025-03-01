import { XMarkIcon } from "@heroicons/react/20/solid";

type Props = {
  onClick: () => void;
  label: string;
};

export default function IconButton({ onClick, label }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-full bg-red-600 p-1 text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      onClick={onClick}
    >
      <XMarkIcon
        aria-hidden="true"
        className="size-3"
      />
    </button>
  );
}
