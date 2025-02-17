import { Field, Label, Switch } from "@headlessui/react";

type Params = Readonly<{
  enabled: boolean;
  disabled: boolean;
  label: string;
  onChange: (enabled: boolean) => void;
}>;

export default function ToggleSwitch({
  disabled,
  label,
  enabled,
  onChange,
}: Params) {
  return (
    <Field className="flex items-center">
      <Label
        as="span"
        className="mr-3 text-xs text-gray-500"
      >
        {label}
      </Label>
      <Switch
        disabled={disabled}
        checked={enabled}
        onChange={onChange}
        className="group relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-hidden"
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-full rounded-md bg-white"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out group-data-[checked]:bg-green-600"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 inline-block size-5 transform rounded-full border border-gray-200 bg-white ring-0 shadow-sm transition-transform duration-200 ease-in-out group-data-[checked]:translate-x-5 group-data-[disabled]:bg-gray-100"
        />
      </Switch>
    </Field>
  );
}
