export default function Card(children: React.ReactNode) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
