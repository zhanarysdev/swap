"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
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
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

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
    key: "business_count",
    title: "Количество компаний",
  },
  {
    key: "influencer_count",
    title: "Количество инфлюэнсеров",
  },
];

const schema = yup
  .object({
    name: yup.string().required("Oбязательное поле"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function DirCategoriesPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);
  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, mutate } = useSWR(
    {
      url: `v1/business/category/list/all`,
      data: {
        "search": context.search,
        "sort_by": "name",
        "sort_dir": "asc"
      },
      custom: true,
    },
    post,
  );

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result,
        labels: labels,
        onDelete: (id) => setDelete(id),
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onEdit: (id) => {
          setValue("name", data.result.find((el) => el.id === id)?.name as any);
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
      url: `v1/business/category/create`,
      custom: true,
      data: {
        name: data.name,
        company_count: 0,
        influencer_count: 0,
      },
    });
    if (res.result === 'success') {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const res = await edit({
      url: `v1/business/category/edit`,
      custom: true,
      data: { id: isEdit, name: data.name },
    }); // Specify the collection and document ID
    if (res.result === 'success') {
      reset();
      setEdit(null);
      setOpen(false);
      mutate();
    }
  }

  async function onRemove() {
    const res = await remove({ url: `v1/business/category/${isDelete}`, custom: true } as any);
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Категории бизнеса"} subTitle={""} />
      <Table />

      {(isOpen || isEdit) &&
        createPortal(
          <ModalSave
            key={isEdit ? "edit-modal" : "add-modal"}
            onSave={handleSubmit(isEdit ? onEdit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => {
              reset({ name: "" });
              setOpen(false);
              setEdit(null);
            }}
          >
            <div className="flex flex-col gap-8">
              <div>
                <Input
                  placeholder="Название"
                  name="name"
                  {...register("name")}
                />
                <FieldError error={errors.name?.message} />
              </div>
            </div>
          </ModalSave>,
          document.getElementById("page-wrapper"),
        )}

      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить"}
            close={() => setDelete(null)}
            onDelete={onRemove}
          />,
          document.getElementById("page-wrapper"),
        )}
    </div>
  );
}
