"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { TableContext } from "@/components/table/table-context";
import { fetcher } from "@/fetcher";
import { db } from "@/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as y from "yup";

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
    key: "price",
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

const schema = y
  .object({
    name: y.string().required("Oбязательное поле"),
    tariff: y
      .number()
      .typeError("Значениями могуть быть толко цифры")
      .required("Oбязательное поле"),
    since: y
      .number()
      .typeError("Значениями могуть быть толко цифры")
      .required("Oбязательное поле(цифры)"),
    to: y
      .number()
      .typeError("Значениями могуть быть толко цифры")
      .required("Oбязательное поле(цифры)"),
  })
  .required();

type FormSchemaType = y.InferType<typeof schema>;

export default function InfluencersPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);

  const { tableData, setTableData } = useContext(TableContext);
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading, mutate } = useSWR(`rank/list`, fetcher);

  useEffect(() => {
    setTableData({ isLoading: isLoading });
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setFilteredData(data.result);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  if (isLoading) return <Spinner />;
  async function remove() {
    await deleteDoc(doc(db, "dir_categories", isDelete));
    setDelete(null);
    mutate();
  }
  const save = async (data: FormSchemaType) => {
    const docRef = await addDoc(collection(db, "influencers_rating"), {
      name: data.name,
      tariff: data.tariff,
      rating: `${data.since}-${data.to}`,
    });
    if (docRef.id) {
      reset();
      setOpen(false);
      mutate();
    }
  };

  async function edit(data: FormSchemaType) {
    const docRef = doc(db, "influencers_rating", isEdit); // Specify the collection and document ID
    await setDoc(docRef, {
      name: data.name,
      tariff: data.tariff,
      rating: `${data.since}-${data.to}`,
    });
    if (docRef.id) {
      reset();
      setEdit(null);
      setOpen(false);
      mutate();
    }
  }

  console.log(watch("since"));

  return (
    <div>
      <Header title={"Рейтинг инфлюэнсеров"} subTitle={""} />
      <Table
        control={{
          action: () => setOpen(true),
          label: "Добавить",
        }}
        data={filteredData}
        onEdit={(id) => {
          reset(
            data.find((el) => {
              const rat = el.rating.split("-");
              if (el.id === id) {
                return {
                  name: el.name,
                  tariff: el.tariff,
                  since: rat[0],
                  to: rat[1],
                };
              }
            }) as any
          );
          setEdit(id);
          setOpen(true);
        }}
        onDelete={(id) => {
          setDelete(id);
        }}
        labels={labels}
      />

      {isOpen &&
        createPortal(
          <ModalSave
            onSave={handleSubmit(isEdit ? edit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => setOpen(false)}
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label label={"Название"} />
                <Input placeholder="Название" {...register("name")} />
                <FieldError error={errors.name?.message} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label={"Тариф"} />
                <Input placeholder="Тариф" {...register("tariff")} />
                <FieldError error={errors.tariff?.message} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label={"Рейтинг вовлеченности"} />
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 w-full">
                    <Input placeholder="От" {...register("since")} />
                    <FieldError error={errors.since?.message} />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Input placeholder="До" {...register("to")} />
                    <FieldError error={errors.to?.message} />
                  </div>
                </div>
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
