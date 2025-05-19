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
import { Select } from "@/components/select/select";
import { Spinner } from "@/components/spinner/spinner";
import Table from "@/components/temp/table";
import {
  TableContext,
  default_context,
} from "@/components/temp/table-provider";
import { edit, fetcher, post, postFile, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

const labels = [
  { key: "id", title: "ID" },
  { key: "order", title: "Очередь" },
  { key: "link", title: "Ссылка", link: true },
  { key: "city", title: "Локация" },
  { key: "image_url", title: "Отображение", image: true },
  { key: "status", title: "Статус", status: true },
];

const schema = yup.object().shape({
  name: yup.string().required('Название обязательно'),
  city_id: yup.string().required('Город обязателен'),
  priority: yup.string().required('Приоритет обязателен'),
  link: yup.string().when('priority', {
    is: 'link',
    then: (schema) => schema.required('Ссылка обязательна'),
    otherwise: (schema) => schema.nullable()
  }),
  advertisment: yup.string().when('priority', {
    is: 'advertisment',
    then: (schema) => schema.required('Ссылка обязательна'),
    otherwise: (schema) => schema.nullable()
  }),
  image: yup.mixed().required('Изображение обязательно')
});

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
  const cities = useSWR(
    {
      url: "city/count",
      data: { request: { search: "", sort_by: "", sort_dir: "" } },
    },
    post
  );

  const {
    register,
    handleSubmit,
    watch,
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
          link: el.link,
        })),
        labels: labels,
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onDelete: (id) => setDelete(id),
        onEdit: (id) => {
          const banner = data.result.find((el) => el.id === id);
          if (banner) {
            console.log(banner)
            if(banner.link.includes('category')){
              setValue("priority", "category");
              setValue("link", banner.link.split('categoryDetail/')[1]);
            }else if(banner.link.includes('taskDetail')){
              setValue("priority", "advertisment");
              setValue("advertisment", banner.link.split('taskDetail/')[1]);
            }else{
              setValue("priority", "link");
              setValue("link", banner.link);
            }
            setValue("city_id", banner.city.id);
            setValue("name", banner.title);
            setValue("image", banner.image_url);
            setOpen(true);
            setEdit(id);
          }
        },
      }));
    } else {
      setContext((prev) => ({
        ...prev,
        data: [],

        control: {
          action: () => setOpen(true),
          label: "Добавить",
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
    let link;
    if(data.priority === 'category'){
      link = `/categoryDetail/${data.link}`
    }else if(data.priority === 'advertisment'){
      link = `/taskDetail/${data.advertisment}`
    }else{
      link = `https://${data.link}`
    }
      const formData = new FormData();
      formData.append("title", data.name)
      formData.append("city_id", data.city_id)
      formData.append("priority", "0")
      formData.append("link",  link)

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    const res = await postFile({
      url: `banner/create`,
      data: formData
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

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const res = await edit({
      url: `banner/edit`,
      data: {
        id: isEdit,
        title: data.name,
        city_id: data.city_id,
        link: watch("priority") === "category" ? `/categoryID/${data.link}` : watch("priority") === "advertisment" ? `/taskID/${data.link}` :  data.link,
        image_url: watch("image")
      },
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

 async function handleDrag(newData: any) {
  const res = await post({
    url: `banner/reorder`,
    data: {
      priorities: newData.map((el: any) => ({
        id: el.id,  
        priority: el.order,
      })),
    },
  });
  if (res.statusCode === 200) {
    mutate();
  }
  }

  return (
    <div>
      <Header title={"Баннеры"} subTitle={"Информация"} />
      <Table draggable onDrag={handleDrag} />
      {(isOpen || isEdit) &&
        createPortal(
          <ModalSave
            label={"Добавить баннер"}
            onSave={handleSubmit(isEdit ? onEdit : save)}
            close={() => {
              setOpen(false);
              setEdit(null);
              reset();
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label label="Название" />
                <Input placeholder="Название" {...register("name")} />
                <FieldError error={errors.name?.message} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label="Город" />
                <Controller
                  control={control}
                  name="city_id"
                  render={({ field }) => (
                    <Select
                      options={cities.data?.result.map((el) => ({
                        value: el.id,
                        label: el.name,
                      }))}
                      data={field.value ?  field.value : "Город"}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FieldError error={errors.city_id?.message} />
              </div>


              <div className="flex flex-col gap-2">
                <Label label="Изображение" />
                <InputFile
                  placeholder="Перенесите сюда файл"
                  onChange={(file) => setValue("image", file)}
                  value={watch("image") as any}
                />
                <FieldError error={errors.image?.message} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label="Приоритетность" />
                <BannerPrior
                  getValues={watch}
                  register={register}
                  errors={errors}
                  control={control}
                  setValue={setValue}
                />
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
