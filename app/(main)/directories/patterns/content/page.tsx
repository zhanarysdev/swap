"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Select } from "@/components/select/select";
import { Spinner } from "@/components/spinner/spinner";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { edit, fetcher, post, remove } from "@/fetcher";
import { db } from "@/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Тип контента",
  },
  {
    key: "format",
    title: "Формат контента",
  },
];

const schema = yup
  .object({
    format: yup.string().required("Oбязательное поле"),
    name: yup.string().required("Oбязательное поле"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function ContentPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);

  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `content/list?search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result,
        labels: labels,
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onDelete: (id) => setDelete(id),
        onEdit: (id) => {
          reset(data.result.find((el) => el.id === id) as any);
          setOpen(true);
          setEdit(id);
        },
      }));
    }
    return () => {
      setContext(default_context);
    };
  }, [data]);

  async function save(data: FormSchemaType) {
    const res = await post({
      url: `content/create`,
      data: { name: data.name, format: data.format },
    });
    if (res.statusCode === 200) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const res = await edit({
      url: "content/edit",
      data: { id: isEdit, name: data.name, format: data.format },
    }); // Specify the collection and document ID
    if (res.statusCode === 200) {
      reset();
      setEdit(null);
      mutate();
    }
  }

  async function onRemove() {
    const res = await remove(`content/${isDelete}`);
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Контент"} subTitle={""} />
      <Table />

      {(isOpen || isEdit) &&
        createPortal(
          <ModalSave
            key={isEdit ? "edit-modal" : "add-modal"}
            onSave={handleSubmit(isEdit ? onEdit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => {
              reset({ name: "", format: "" });
              setOpen(false);
              setEdit(null);
            }}
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label label={"Тип контента"} />
                <Input placeholder="Тип" {...register("name")} />
                <FieldError error={errors.name?.message} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label={"Формат контента"} />
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      data={value ? value : "Формат"}
                      options={[
                        { value: "video", label: "Видео" },
                        { value: "photo", label: "Фото" },
                      ]}
                      onChange={onChange}
                    />
                  )}
                  name={"format"}
                />
                <FieldError error={errors.format?.message} />
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
            onDelete={onRemove}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
