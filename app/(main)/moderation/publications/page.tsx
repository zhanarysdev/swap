"use client";
import { Header } from "@/components/header/header";
import { default_context, TableContext } from "@/components/temp/table-provider";
import Table from "@/components/temp/table";
import { fetcher } from "@/fetcher";
import { useContext, useEffect } from "react";
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
    key: "categories",
    title: "Категория",
    category: true,
  },
  {
    key: "display_number",
    title: "Контакт",
  },
];

export default function ModerationPublicationsPage() {
  const { context, setContext } = useContext(TableContext);

  const { data, isLoading, mutate } = useSWR(
    { url: `moderation/tasks?status=pending_review&page=1&limit=10` },
    fetcher
  );
  useEffect(() => {
    if (data?.result?.tasks) {
      setContext(prev => ({
        ...prev,
        data: data?.result.tasks?.map((el: any) => ({
          ...el,
          deadline: `${new Date(
            el.start_date
          ).toLocaleDateString()} - ${new Date(
            el.end_date
          ).toLocaleDateString()}`,
          id: el.task_id,
        })),
        filters: ['business_name', 'budget', 'deadline', 'category'],
        labels: labels,
        goTo: "/moderation/publications",
      }));
    }
  }, [data]);

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    }
  }, [])

  return (
    <div>
      <Header title={"Модерация"} subTitle={"Информация"} />
      <Table />
    </div>
  );
}
