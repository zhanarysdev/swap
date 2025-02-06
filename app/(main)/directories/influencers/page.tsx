"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { Modal } from "@/components/modal/modal";
import { ModalDelete } from "@/components/modal/modal-delete";
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
    key: "name",
    title: "Название",
  },
  {
    key: "traiff",
    title: "Тариф",
  },
  {
    key: "rating",
    title: "Рейтинг вовлеченности",
  },
  {
    key: "count",
    title: "Количество инфлюэнсеров",
  },
];

const url = "https://ninety-beans-jog.loca.lt";

export default function CitiesPage() {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isEdit, setEdit] = useState<null | string>(null);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [valueError, setValueError] = useState<undefined | string>(undefined);
  const { data, isLoading, mutate } = useSWR(`${url}/influencers`, fetcher);
  const remove = async () => {
    const res = await fetch(`${url}/influencers/${isDelete}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setDelete(null);
      mutate();
    }
  };

  const save = async () => {
    if (!value) {
      return setValueError("Обязательное поле");
    } else {
      setValueError(undefined);
    }
    if (isEdit) {
      const res = await fetch(`${url}/influencers/${isEdit}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value,
          company_count: 0,
          influencer_count: 0,
        }),
      });
      if (res.ok) {
        setEdit(null);
        setOpen(false);
        mutate();
      }
    } else {
      const res = await fetch(`${url}/influencers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value,
          company_count: 0,
          influencer_count: 0,
        }),
      });
      if (res.ok) {
        setOpen(false);
        mutate();
      }
    }
    setValue("");
  };
  const edit = async (id: string) => {
    setEdit(id);
    setValue(data.find((el: any) => el.id === id).name);
    setOpen(true);
  };

  if (isLoading) return <div>...loading</div>;

  return (
    <div>
      <Header title={"Рейтинг инфлюэнсеров"} subTitle={""} />
      <Table
        data={data}
        labels={labels}
        onDelete={(id) => setDelete(id)}
        onEdit={edit}
        control={{
          label: "Добавить",
          action: () => {
            setOpen(true);
          },
        }}
      />
      {isOpen &&
        createPortal(
          <Modal
            close={() => {
              setValue("");
              setOpen(false);
            }}
            onSave={save}
            label={isEdit ? "Редактировать" : "Добавить"}
          >
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-2">
                <Label label={"Название"} />
                <Input
                  placeholder="Название"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <FieldError error={valueError} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label={"Тариф"} />
                <Input
                  placeholder="Тариф"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <FieldError error={valueError} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label={"Рейтинг вовлеченности"} />
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      placeholder="Название"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <FieldError error={valueError} />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      placeholder="Название"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <FieldError error={valueError} />
                  </div>
                </div>
              </div>
            </div>
          </Modal>,
          document.getElementById("page-wrapper") as any
        )}
      {isDelete &&
        createPortal(
          <ModalDelete
            close={() => {
              setDelete(null);
            }}
            onDelete={remove}
            label="Вы точно хотите удалить этот город?"
          />,
          document.getElementById("page-wrapper") as any
        )}
    </div>
  );
}
