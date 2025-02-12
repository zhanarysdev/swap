import { Header } from "@/components/header/header";
import { Table } from "@/components/table/table";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "company",
    title: "Компания",
  },
  {
    key: "participants",
    title: "Участников",
  },
  {
    key: "budget",
    title: "Бюджет",
  },
  {
    key: "deadline",
    title: "Срок",
  },
  {
    key: "category",
    title: "Категория",
  },
  {
    key: "contact",
    title: "Контакт",
  },
];

export default function ModerationPage() {
  return (
    <div>
      <Header title={"Модерация"} subTitle={"Информация"} />
      <Table data={[]} labels={labels} />
    </div>
  );
}
