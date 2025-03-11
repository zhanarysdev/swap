"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Select } from "@/components/select/select";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { TableContext } from "@/components/table/table-context";
import { fetcher } from "@/fetcher";
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
    type: yup.string().required("Oбязательное поле"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function ContentPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);

  const { tableData, setTableData } = useContext(TableContext);
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading, mutate } = useSWR({ url: `content/list` }, fetcher);

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
    control,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  async function save(data: FormSchemaType) {
    const docRef = await addDoc(collection(db, "content"), {
      format: data.format,
      type: data.type,
    });
    if (docRef.id) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function edit(data: FormSchemaType) {
    const docRef = doc(db, "content", isEdit); // Specify the collection and document ID
    await setDoc(docRef, {
      format: data.format,
      type: data.type,
    });
    if (docRef.id) {
      reset();
      setEdit(null);
      mutate();
    }
  }

  async function remove() {
    await deleteDoc(doc(db, "content", isDelete));
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Контент"} subTitle={""} />
      <Table
        data={filteredData}
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
              reset({ type: "", format: "" });
              setOpen(false);
              setEdit(null);
            }}
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label label={"Тип контента"} />
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      data={value ? value : "Тип"}
                      options={[
                        { value: "Aнпакинг", label: "Aнпакинг" },
                        {
                          value: "Cелфи с продукцией",
                          label: "Cелфи с продукцией",
                        },
                      ]}
                      onChange={onChange}
                    />
                  )}
                  name={"type"}
                />
                <FieldError error={errors.type?.message} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label={"Формат контента"} />
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      data={value ? value : "Формат"}
                      options={[
                        { value: "Видео", label: "Видео" },
                        { value: "Фото", label: "Фото" },
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
            onDelete={remove}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
