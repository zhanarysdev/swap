"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { ModalDelete } from "@/components/modal/modal-delete";
import { Table } from "@/components/table/table";
import { default_context, TableContext } from "@/components/temp/table-provider";
import { fetcher } from "@/fetcher";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "title",
    title: "Заголовок",
  },
  {
    key: "message",
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
    key: "created_at",
    title: "Время",
  },
  {
    key: "recipient_count",
    title: "Количество",
  },
];

export default function NotificationsPage() {
  const [isDelete, setDelete] = useState<null | string>(null);

  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `notification/list?page=1&search=${debouncedSearch}&sortBy=${context.sortValue }`,
    },
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000
    }
  );
  console.log(data)

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result.items,
        labels: labels,
        goTo: "/busines",
        sort: [
          "name",
          "city",
          "balance",
          "category",
          "lastTaskDate",
          "taskCount",
        ],
        filters: ["city", "category"],
      }));
    }
  }, [data, setContext]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);
  const remove = () => {
    console.log("asld");
  };

  return (
    <div>
      <Header subTitle="Информация" title="Уведомления" />
      <Table
        data={context.data}
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
