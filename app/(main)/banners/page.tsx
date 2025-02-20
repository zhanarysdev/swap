"use client";
import { BannerPrior } from "@/components/banner-prior/banner-prior";
import { Header } from "@/components/header/header";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import { TableDragable } from "@/components/table/table-dragable";
import { fetcher } from "@/fetcher";
import { useState } from "react";
import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import useSWR from "swr";

const labels = [
  { key: "id", title: "ID" },
  { key: "order", title: "Очередь" },
  { key: "link", title: "Ссылка" },
  { key: "city", title: "Локация" },
  { key: "presentation", title: "Отображение" },
  { key: "status", title: "Статус" },
];

export default function BannersPage() {
  const { data, isLoading, mutate } = useSWR("banners", fetcher);
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);

  const {
    reset,
    register,
    control,
    formState: { errors },
  } = useForm();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <Header title={"Баннеры"} subTitle={"Информация"} />
      <TableDragable
        data={data}
        labels={labels}
        onEdit={(id) => {
          reset(data.find((el) => el.id === id) as any);
          setEdit(id);
        }}
        onDelete={(id) => {
          setDelete(id);
        }}
        control={{
          label: "Добавить",
          action: () => setOpen(true),
        }}
      />
      {isOpen &&
        createPortal(
          <ModalSave label={"Добавить баннер"} close={() => setOpen(false)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label label="Город" />
                <Input placeholder="Город" {...register("Город")} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Изображение" />
                <Input
                  placeholder="Перенесите сюда файл"
                  {...register("image")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label label="Приоритетность" />
                <BannerPrior
                  errors={errors}
                  control={control}
                  register={register}
                />
              </div>
            </div>
          </ModalSave>,
          document.getElementById("page-wrapper")
        )}

      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить"}
            close={() => setDelete(null)}
            onDelete={() => console.log(isDelete)}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
