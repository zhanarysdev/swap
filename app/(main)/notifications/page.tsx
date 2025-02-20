"use client";
import { Header } from "@/components/header/header";
import { ModalDelete } from "@/components/modal/modal-delete";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import { useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "label",
    title: "Заголовок",
  },
  {
    key: "text",
    title: "Текст",
  },
  {
    key: "filter",
    title: "Фильтр",
  },
  {
    key: "link",
    title: "Ссылка",
  },
  {
    key: "time",
    title: "Время",
  },
  {
    key: "count",
    title: "Количество",
  },
];
const data = [
  {
    id: "oijwoef",
    label: "Заголовок",
    text: "Новая акция",
    filter: ["Алматы", "Мужчины"],
    link: "https://swapp.kz",
    time: "12.00 12.04.2024",
    count: "53",
  },
];

export default function NotificationsPage() {
  const [isDelete, setDelete] = useState<null | string>(null);

  const remove = () => {
    console.log("asld");
  };

  return (
    <div>
      <Header subTitle="Информация" title="Уведомления" />
      <Table
        data={data}
        labels={labels}
        goTo="/notifications"
        onDelete={(id) => setDelete(id)}
      />
      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить уведомление"}
            close={() => setDelete(null)}
            onDelete={remove}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
