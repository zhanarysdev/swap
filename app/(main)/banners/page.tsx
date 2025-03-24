"use client";
import { BannerPrior } from "@/components/banner-prior/banner-prior";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputFile } from "@/components/input/input-file";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import Table from "@/components/temp/table";
import { TableContext, default_context } from "@/components/temp/table-provider";
import { edit, fetcher, post, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

const labels = [
  { key: "id", title: "ID" },
  { key: "order", title: "Очередь" },
  { key: "link", title: "Ссылка", link: true },
  { key: "city", title: "Локация" },
  { key: "presentation", title: "Отображение" },
  { key: "status", title: "Статус", status: true },
];

const schema = yup
  .object({
    city_id: yup.string().required("Oбязательное поле"),
    priority: yup.number().required("Oбязательное поле"),
    link: yup.string().required("Oбязательное поле"),
    image: yup.mixed().required("Oбязательное поле"),
    is_active: yup.boolean().required("Oбязательное поле"),
  })
  .required();

type FormSchemaType = yup.InferType<typeof schema>;

export default function BannersPage() {
  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `banner/list?page=1&search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (debouncedSearch) {
      mutate();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data?.result.map((el) => ({
          ...el,
          city: el.city.name.ru,
          order: el.priority,
          status: el.is_active ? "active" : "not_active",
          link: el.link
        })),
        labels: labels,
        sort: ["order", "city", "status"],
        filters: ["city", "status"],
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onDelete: (id) => setDelete(id),
        onEdit: (id) => {
          const banner = data.result.find((el) => el.id === id);
          if (banner) {
            setValue("city_id", banner.city.id);
            setValue("priority", banner.priority);
            setValue("link", banner.link);
            setValue("is_active", banner.is_active);
            setOpen(true);
            setEdit(id);
          }
        },
      }));
    }
  }, [data, setContext]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  async function save(data: FormSchemaType) {
    const formData = new FormData();
    formData.append("city_id", data.city_id);
    formData.append("priority", data.priority.toString());
    formData.append("link", data.link);
    formData.append("is_active", data.is_active.toString());
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const res = await post({
      url: `banner/create`,
      data: formData,
    });
    if (res.statusCode === 200) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const formData = new FormData();
    formData.append("city_id", data.city_id);
    formData.append("priority", data.priority.toString());
    formData.append("link", data.link);
    formData.append("is_active", data.is_active.toString());
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const res = await edit({
      url: `banner/${isEdit}`,
      data: formData,
    });
    if (res.statusCode === 200) {
      reset();
      setEdit(null);
      setOpen(false);
      mutate();
    }
  }

  async function onRemove() {
    const res = await remove({ url: `banner/${isDelete}` });
    if (res.statusCode === 200) {
      setDelete(null);
      mutate();
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <Header title={"Баннеры"} subTitle={"Информация"} />
      <Table />
      {isOpen &&
        createPortal(
          <ModalSave label={"Добавить баннер"} onSave={handleSubmit(save)} close={() => setOpen(false)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label label="Город" />
                <Input placeholder="Город" {...register("city_id")} />
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Изображение" />
                <InputFile
                  placeholder="Перенесите сюда файл"
                  onChange={(file) => setValue("image", file)}/>
              </div>
              <div className="flex flex-col gap-2">
                <Label label="Приоритетность" />
                <BannerPrior register={register} errors={errors} control={control} />
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
