"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { edit, fetcher, post, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
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
    rank: true,
  },
  {
    key: "user_count",
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

  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `rank/list`,
      data: {
        search: debouncedSearch,
        sort: context.sortValue,
      },
    },
    post,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
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
        data: data.result.map((el) => ({...el, rating: `${el.min_rating} - ${el.max_rating}`})),
        labels: labels,
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onDelete: (id) => setDelete(id),
        onEdit: (id) => {
          setValue("name", data.result.find((el) => el.id === id)?.name as any);
          setValue("tariff", data.result.find((el) => el.id === id)?.price as any);
          setValue("since", data.result.find((el) => el.id === id)?.min_rating as any);
          setValue("to", data.result.find((el) => el.id === id)?.max_rating as any);
          setOpen(true);
          setEdit(id);
        },
      }));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  async function save(data: FormSchemaType) {
    const res = await post({
      url: `rank/create`,
      data: {
        name: data.name,
        price: data.tariff,
        min_rating: data.since,
        max_rating: data.to,
      },
    });
    if(res.result === "min_rating must be less than max_rating" ) {
      setError("since", { message: "Минимальный рейтинг должен быть меньше максимального" });
    }
    if(res.result === "rating range overlaps with existing rank") {
      setError("root", { message: "Диапазон рейтинга пересекается с существующим" });
    }
    if (res.statusCode === 200) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const res = await edit({
      url: "rank/edit",
      data: {
        id: isEdit,
        name: data.name,
        price: data.tariff,
        min_rating: data.since,
        max_rating: data.to,
      },
    }); // Specify the collection and document ID
    if (res.statusCode === 200) {
      reset();
      setEdit(null);
      setOpen(false);
      mutate();
    }
  }

  async function onRemove() {
    const res = await remove({ url: `rank/${isDelete}` } as any);
    setDelete(null);
    mutate();
  }


  return (
    <div>
      <Header title={"Рейтинг инфлюэнсеров"} subTitle={""} />
      <Table />

      {isOpen &&
        createPortal(
          <ModalSave
            onSave={handleSubmit(isEdit ? onEdit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => {
              setOpen(false)
              reset()
            }}
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
                    <FieldError error={errors.root?.message} />
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
