"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { Modal } from "@/components/modal/modal";
import { ModalDelete } from "@/components/modal/modal-delete";
import { Select } from "@/components/select/select";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import { count } from "console";
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
    key: "city",
    title: "Город",
  },
  {
    key: "count",
    title: "Количество объявлений",
  },
];

export default function CategoriesPage() {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isEdit, setEdit] = useState<null | string>(null);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [valueError, setValueError] = useState<undefined | string>(undefined);
  const [cityError, setCityError] = useState<undefined | string>(undefined);
  const [city, setCity] = useState<null | string>(null);
  const cities = useSWR("http://localhost:4000/cities", fetcher);
  const { data, isLoading, mutate } = useSWR(
    "http://localhost:4000/categories",
    fetcher
  );
  const remove = async () => {
    const res = await fetch(`http://localhost:4000/categories/${isDelete}`, {
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
    if (!city) {
      return setCityError("Обязательное поле");
    } else {
      setCityError(undefined);
    }
    if (isEdit) {
      const res = await fetch(`http://localhost:4000/categories/${isEdit}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value,
          city: city,
        }),
      });
      if (res.ok) {
        setEdit(null);
        setOpen(false);
        mutate();
      }
    } else {
      const res = await fetch("http://localhost:4000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value,
          city: city,
          count: 0,
        }),
      });
      if (res.ok) {
        setOpen(false);
        mutate();
      }
    }
    setValue("");
    setCity(null);
  };
  const edit = async (id: string) => {
    setEdit(id);
    setValue(data.find((el: any) => el.id === id).name);
    setOpen(true);
  };

  if (isLoading) return <div>...loading</div>;

  return (
    <div>
      <Header title={"Подборки категорий"} subTitle={"Информация"} />
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
            label={isEdit ? "Редактировать город" : "Название города"}
          >
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-2">
                <Label label={"Категория"} />
                <Input
                  placeholder="Категория"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <FieldError error={valueError} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label={"Категория"} />
                <Select
                  data={city ? city : "Город"}
                  options={
                    cities.data
                      ? cities.data.map((el: any) => ({
                          value: el.name,
                          label: el.name,
                        }))
                      : []
                  }
                  onChange={function (v: string): void {
                    setCity(v);
                  }}
                />
                <FieldError error={cityError} />
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
