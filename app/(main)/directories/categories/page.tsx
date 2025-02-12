"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import { db } from "@/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
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
    key: "company_count",
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

  const { data, isLoading, mutate } = useSWR(`dir_categories`, fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  if (isLoading) return <Spinner />;

  async function save(data: FormSchemaType) {
    const docRef = await addDoc(collection(db, "dir_categories"), {
      name: data.name,
      company_count: 0,
      influencer_count: 0,
    });
    if (docRef.id) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function edit(data: FormSchemaType) {
    const docRef = doc(db, "dir_categories", isEdit); // Specify the collection and document ID
    await setDoc(docRef, {
      name: data.name,
    });
    if (docRef.id) {
      reset();
      setEdit(null);
      mutate();
    }
  }

  async function remove() {
    await deleteDoc(doc(db, "dir_categories", isDelete));
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Категории бизнеса"} subTitle={""} />
      <Table
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

      {(isOpen || isEdit) &&
        createPortal(
          <ModalSave
            key={isEdit ? "edit-modal" : "add-modal"}
            onSave={handleSubmit(isEdit ? edit : save)}
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
          document.getElementById("page-wrapper")
        )}

      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить"}
            close={() => setDelete(null)}
            onDelete={remove}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
