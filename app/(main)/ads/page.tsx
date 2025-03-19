"use client";
import { Button, ButtonBG } from "@/components/button/button";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { Icon } from "@/components/icons";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
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
    key: "total_budget",
    title: "Бюджет",
  },
  {
    key: "end_date",
    title: "Срок",
  },
  {
    key: "publication_type",
    title: "Тип",
  },
  {
    key: "ad_type",
    title: "Reels",
    rounded: true,
  },
  {
    key: "has_restriction",
    title: "Ограничения",
    boolean: true,
  },
  {
    key: "status",
    title: "Статус",
  },
];

export default function Ads() {
  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading } = useSWR(
    {
      url: `tasks?page=1&search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher
  );

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result.tasks,
        labels: labels,
        goTo: "/ads",
      }));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-start">
        <Header title={"Объявления"} subTitle={"Информация"} />
        <Button
          styles="items-center"
          preIcon={<Icon name={"Plus"} />}
          bg={ButtonBG.grey}
          label={"Создать подборку"}
        />
      </div>
      <Table />
    </div>
  );
}
