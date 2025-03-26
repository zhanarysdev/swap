"use client";
import { Button, ButtonBG } from "@/components/button/button";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { Icon } from "@/components/icons";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { ModalSave } from "@/components/modal/modal-save";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { fetcher, post } from "@/fetcher";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
    key: "publication_type",
    title: "Тип",
    rounded: true,
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
    status: true,
  },
];

export default function Ads() {
  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useSWR(
    {
      url: `tasks?page=1&search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher
  );
  console.log(context)

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result.tasks.map((el) => ({...el, budget: `${el.spent_budget} / ${el.total_budget}`, deadline: `${ new Date(el.start_date).toLocaleDateString()} - ${new Date(el.end_date).toLocaleDateString()}`})),
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

  const {register, handleSubmit} = useForm()

  const onSave = async (data: any) => {
    const res = await post({url: "selection/create", data: {name: data.name}})
    console.log(res);
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <Header title={"Объявления"} subTitle={"Информация"} />
        <Button
          styles="items-center"
          preIcon={<Icon name={"Plus"} />}
          bg={ButtonBG.grey}
          label={"Создать подборку"}
          onClick={() => setOpen(true)}
        />
      </div>
      <Table />
      {
        open && <ModalSave label={"Создать подборку"} onSave={handleSubmit(onSave)} close={() => setOpen(false)}>
          <div className="flex flex-col gap-2">
            <Label label="Название"/>
            <Input placeholder="Название" {...register("name")} />
          </div>
        </ModalSave>
      }
    </div>
  );
}
