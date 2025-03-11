"use client";

import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { TableContext } from "@/components/table/table-context";
import { edit, fetcher, post, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
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
    key: "businesses_count",
    title: "Количество компаний",
  },
  {
    key: "users_count",
    title: "Количество инфлюэнсеров",
  },
];

const schema = yup
  .object({
    name: yup.string().required("Oбязательное поле"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function CitiesPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);
  const [search, setSearch] = useState("");
  const { tableData, setTableData } = useContext(TableContext);

  const { data, isLoading, mutate } = useSWR(
    { url: `city/count?search=${search}` },
    fetcher
  );

  useEffect(() => {
    setTableData({ isLoading: isLoading });
  }, [isLoading]);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.result) {
      setFilteredData(data.result.map((el) => ({ ...el, name: el.name.ru })));
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  async function save(data: FormSchemaType) {
    const res = await post({
      url: `city/create`,
      data: { name: data.name },
    });
    if (res.statusCode === 200) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const res = await edit({
      url: "city/edit",
      data: { id: isEdit, name: data.name },
    }); // Specify the collection and document ID
    if (res.statusCode === 200) {
      reset();
      setEdit(null);
      setOpen(false);
      mutate();
    }
  }

  async function onRemove() {
    const res = await remove(`city/${isDelete}`);
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Города"} subTitle={""} />
      <Table
        onSearch={setSearch}
        data={filteredData}
        labels={labels}
        onEdit={(id) => {
          reset(filteredData.find((el) => el.id === id) as any);
          setEdit(id);
          setOpen(true);
        }}
        onDelete={(id) => {
          setDelete(id);
        }}
        control={{
          label: "Добавить",
          action: () => {
            reset();
            setOpen(true);
          },
        }}
      />

      {isOpen &&
        createPortal(
          <ModalSave
            key={isEdit ? "edit-modal" : "add-modal"}
            onSave={handleSubmit(isEdit ? onEdit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => {
              setOpen(false);
              setEdit(null);
              reset({ name: "" });
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
            onDelete={onRemove}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
