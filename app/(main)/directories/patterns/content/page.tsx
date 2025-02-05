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
import { useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "type",
    title: "Тип контента",
  },
  {
    key: "format",
    title: "Формат контента",
  },
];

export default function ContentPage() {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [format, setFormat] = useState<null | string>(null);
  const [valueError, setValueError] = useState<undefined | string>(undefined);
  const [formatError, setFormatError] = useState<undefined | string>(undefined);

  const { data, isLoading, mutate } = useSWR(
    "http://localhost:4000/content",
    fetcher
  );
  const remove = async () => {
    const res = await fetch(`http://localhost:4000/content/${isDelete}`, {
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
    if (!format) {
      return setFormatError("Обязательное поле");
    } else {
      setFormatError(undefined);
    }
    if (isEdit) {
      const res = await fetch(`http://localhost:4000/content/${isEdit}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: value,
          format: format,
        }),
      });
      if (res.ok) {
        setEdit(null);
        setOpen(false);
        mutate();
      }
    } else {
      const res = await fetch("http://localhost:4000/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: value,
          format: format,
        }),
      });
      if (res.ok) {
        setOpen(false);
        mutate();
      }
    }

    setValue(null);
    setFormat(null);
  };
  const edit = async (id: string) => {
    setEdit(id);
    setValue(data.find((el: any) => el.id === id).type);
    setFormat(data.find((el: any) => el.id === id).format);
    setOpen(true);
  };

  if (isLoading) return <div>...loading</div>;

  return (
    <div>
      <Header title={"Контент"} subTitle={""} />
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
              setValue(null);
              setFormat(null);
              setOpen(false);
            }}
            onSave={save}
            label={isEdit ? "Редактировать" : "Добавить"}
          >
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-2">
                <Select
                  data={value ? value : "Название"}
                  onChange={(v: string) => setValue(v)}
                  options={[
                    { value: "Aнпакинг", label: "Aнпакинг" },
                    {
                      value: "Cелфи с продукцией",
                      label: "Cелфи с продукцией",
                    },
                  ]}
                />
                <FieldError error={valueError} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label={"Формат контента"} />
                <Select
                  data={format ? format : "Название"}
                  onChange={(v: string) => setFormat(v)}
                  options={[
                    { value: "Видео", label: "Видео" },
                    { value: "Фото", label: "Фото" },
                  ]}
                />
                <FieldError error={formatError} />
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
