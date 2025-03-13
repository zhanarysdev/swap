"use client";
import { Header } from "@/components/header/header";
import { Table } from "@/components/table/table";
import { TableContext } from "@/components/table/table-context";
import { fetcher } from "@/fetcher";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "business_name",
    title: "Компания",
  },
  {
    key: "influencer_amount",
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

export default function ModerationPublicationsPage() {
  const { tableData, setTableData } = useContext(TableContext);
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading, mutate } = useSWR(
    { url: `moderation/tasks?status=pending_review&page=1&limit=10` },
    fetcher
  );

  useEffect(() => {
    setTableData({ isLoading: isLoading });
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setFilteredData(data.result.tasks);
    }
  }, [data]);
  return (
    <div>
      <Header title={"Модерация"} subTitle={"Информация"} />
      <Table data={filteredData} labels={labels} />
    </div>
  );
}
