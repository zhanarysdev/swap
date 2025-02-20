"use client";
import { Header } from "@/components/header/header";
import { Table } from "@/components/table/table";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Компания",
  },
  {
    key: "count",
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
    key: "type",
    title: "Тип",
  },
  {
    key: "format",
    title: "Reels",
    rounded: true,
  },
  {
    key: "restriction",
    title: "Ограничения",
  },
  {
    key: "status",
    title: "Статус",
  },
];

const data = [
  {
    id: "ojfojweofiwe",
    name: "Gippo",
    count: "5/7",
    budget: "25000 / 30000",
    deadline: "15.07.2024 - 19.10.2024",
    type: "Reels",
    format: "Video",
    restriction: "Да",
    status: "Активно",
  },
];

export default function Ads() {
  return (
    <div>
      <Header title={"Объявления"} subTitle={"Информация"} />
      <Table goTo="/ads/" data={data} labels={labels} />
    </div>
  );
}
