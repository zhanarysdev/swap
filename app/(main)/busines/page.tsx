"use client";
import { Header } from "@/components/header/header";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import useSWR from "swr";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Название",
  },
  {
    key: "city",
    title: "Город",
    isObject: true,
  },
  {
    key: "advertisements",
    title: "Объявления",
  },
  {
    key: "category",
    title: "Категория",
    rounded: true,
  },
  {
    key: "balance",
    title: "Баланс",
  },
  {
    key: "contact",
    title: "Контакт Мен.",
  },
  {
    key: "socials",
    title: "Соцсети",
    link: "https://www.instagram.com/",
  },
  {
    key: "update",
    title: "Последнее объявление",
    timeStamp: true,
  },
];

export default function BusinesPage() {
  const { data, isLoading } = useSWR("business", fetcher);
  if (isLoading) return <Spinner />;
  return (
    <div>
      <Header title={"Бизнес"} subTitle={"Информация"} />
      <Table data={data} labels={labels} goTo="/busines" />
    </div>
  );
}
