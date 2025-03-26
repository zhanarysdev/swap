"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Select } from "@/components/select/select";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { edit, fetcher, post, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
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
    key: "title",
    title: "Название",
  },
  {
    key: "city_name",
    title: "Город",
  },
  {
    key: "task_count",
    title: "Количество объявлений",
  },
];

const schema = yup
  .object({
    name: yup.string().required("Oбязательное поле"),
    city_id: yup.string().required("Oбязательное поле"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function CategoriesPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);

  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `selection/list?search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher
  );
  const cities = useSWR({url: "city/list"}, fetcher)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
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
        data: data?.result.map((el) => ({ ...el })),
        labels: labels,
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onDelete: (id) => setDelete(id),
        onEdit: (id) => {
          setValue(
            "name",
            data.result.find((el) => el.id === id)?.name.ru as any
          );
          setOpen(true);
          setEdit(id);
        },
      }));
    }

  }, [data]);

  useEffect(() => {
    setContext(default_context)
  }, [])

  async function save(data: FormSchemaType) {
    const res = await post({
      url: `selection/create`,
      data: { title: data.name, city_id: data.city_id },
    });
    if (res.statusCode === 200) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const res = await edit({
      url: "selection/edit",
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
    const res = await remove(`selection/${isDelete}` as any);
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Подборки категорий"} subTitle={"Информация"} />
      <Table />

      {(isOpen || isEdit) &&
        createPortal(
          <ModalSave
            key={isEdit ? "edit-modal" : "add-modal"}
            onSave={handleSubmit(isEdit ? onEdit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => {
              reset({ name: "", city_id: "" });
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

              <div>
                <Controller
                  control={control}
                  name="city_id"
                  render={({ field }) => (
                    <Select
                      data={cities.data?.result}
                      options={cities.data?.result.map((el: any) => ({
                        label: el.name.ru,
                        value: el.id,
                      }))}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FieldError error={errors.city_id?.message} />
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
