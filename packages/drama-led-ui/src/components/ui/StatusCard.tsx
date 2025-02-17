type Params = Readonly<{
  children: React.ReactNode;
  title: string;
}>;

export default function Card({ children, title }: Params) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm w-[400px] grow">
      <div className="border-b border-gray-200 bg-white px-2 py-2">
        <div className="-mt-2 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="mt-2 ml-4">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
          {/* <div className="mt-2 ml-4 shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Do the thing.
            </button>
          </div> */}
        </div>
      </div>
      <div className="px-2 py-2">{children}</div>
    </div>
  );
}
