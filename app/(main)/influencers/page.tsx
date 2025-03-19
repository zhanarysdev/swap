"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputFile } from "@/components/input/input-file";
import { Label } from "@/components/input/label";
import { Text } from "@/components/input/text";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { fetcher, post, postFile } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import * as y from "yup";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "fullname",
    title: "Имя",
  },
  {
    key: "city",
    title: "Город",
    name: true,
  },
  {
    key: "advertisment",
    title: "Объявления",
  },
  {
    key: "gender",
    title: "Пол",
    gender: true
  },
  {
    key: "age",
    title: "Возраст",
  },
  {
    key: "rank",
    title: "Рейтинг",
    rank: true,
  },
  {
    key: "category",
    title: "Категория",
    category: true,
  },
  {
    key: "restriction_ad",
    title: "Ограничения",
    restriction: true,
  },
];

const sort = ["name", "city", "sex", "age", "status", "category"];

const schema = y
  .object({
    label: y.string().required("Oбязательное поле"),
    text: y.string().max(300).required("Oбязательное поле"),
    link: y.string().required("Oбязательное поле"), 
    photo: y.mixed().required("Oбязательное поле"),
  })
  .required();

type FormData = y.InferType<typeof schema>;

export default function ModerationPage() {
  const [isOpen, setOpen] = useState(false);

  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `influencer/list`,
      data: {
        page: 1,
        search: debouncedSearch,
        sortBy: context.sortValue,
      },
    },
    post
  );

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
        data: data.result.items.map(el => ({...el, category: el.categories, rank: el.rank.name, advertisment: `${el.completed_visit_count} / ${el.cancelled_visit_count}`})),
        labels: labels,
        goTo: "/influencers",
        sort: sort,
        filters: ["city", "category", "taskCount"],
        control: {
          label: "Отправить уведомление",
          action: () => setOpen(true),
        },
      }));
    }
  }, [data, setContext]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });


  const save = async (data: FormData) => {
    const formData = new FormData();

    // Add required fields according to API format
    formData.append("user_ids", context.checked.join(','));
    formData.append("message", data.text || '');
    formData.append("from", data.label || '');
    formData.append("navigate", data.link || ''); // Using link as navigate parameter
    formData.append("link", data.link || '');
    
    // Handle image file
    if (data.photo instanceof File) {
      formData.append("image", data.photo);
    }

    const res = await postFile({
      url: "notification/send",
      data: formData,
    });
    
    if (res.success) {
      setOpen(false);
    }
  };

  return (
    <div>
      <Header title={"Инфлюенсеры"} subTitle={"Информация"} />
      <Table />
      {isOpen &&
        createPortal(
          <ModalSave
            onSave={handleSubmit(save)}
            label={"Отправка уведомления"}
            close={() => setOpen(false)}
            buttonLabel="Отправить"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label label={"Заголовок"} />
                <Input placeholder="Заголовок" {...register("label")} />
                <FieldError error={errors.label?.message} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label={"Текст"} />
                <Text
                  count={watch("text")?.length || 0}
                  maxCount={300}
                  maxLength={300}
                  placeholder="Об акции"
                  {...register("text")}
                />
                <FieldError error={errors.text?.message} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label={"Ссылка"} />
                <Input placeholder="Ссылка" {...register("link")} />
                <FieldError error={errors.link?.message} />
              </div>
              <div className="flex flex-col gap-2">
                <Label label={"Фото"} />
                <Controller
                  control={control}
                  name="photo"
                  render={({ field: { value, onChange } }) => (
                    <InputFile
                      placeholder="Перенесите сюда файл"
                      value={value instanceof File ? value.name : ""}
                      onChange={onChange}
                    />
                  )}
                />
                <FieldError error={errors.photo?.message} />
              </div>
            </div>
          </ModalSave>,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
