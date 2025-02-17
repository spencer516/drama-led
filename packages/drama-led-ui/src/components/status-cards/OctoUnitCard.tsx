import Card from "../ui/StatusCard";

type Params = Readonly<{
  title: string;
}>;

export default function OctoUnitCard({ title }: Params) {
  return <Card title={title}>Content...</Card>;
}
