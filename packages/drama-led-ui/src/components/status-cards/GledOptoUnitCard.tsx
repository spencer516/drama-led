import Card from "../ui/StatusCard";

type Params = Readonly<{
  title: string;
}>;

export default function GledOptoUnitCard({ title }: Params) {
  return <Card title={title}>Content...</Card>;
}
