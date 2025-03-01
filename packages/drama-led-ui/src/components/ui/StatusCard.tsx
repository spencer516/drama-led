type Params = Readonly<{
  children?: React.ReactNode | null;
  actions?: React.ReactNode | null;
  footer?: React.ReactNode | null;
  title: React.ReactNode | string;
  subtitle?: string;
  className?: string | null;
}>;

export default function Card({
  actions,
  footer,
  children,
  title,
  subtitle,
  className,
}: Params) {
  return (
    <div
      className={`divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm w-[400px] grow shrink ${className}`}
    >
      <div
        className={`${children == null ? null : "border-b border-gray-200"} bg-white px-2 py-2`}
      >
        <div className="-mt-2 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="mt-2 ml-4">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {subtitle == null ? null : (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions == null ? null : (
            <div className="mt-2 ml-4 shrink-0">{actions}</div>
          )}
        </div>
      </div>
      {children == null ? null : <div className="px-2 py-2">{children}</div>}
      {footer == null ? null : <div className="px-2 py-2">{footer}</div>}
    </div>
  );
}
