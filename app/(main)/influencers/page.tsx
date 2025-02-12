"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { Label } from "@/components/input/label";
import { Text } from "@/components/input/text";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
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
    title: "Имя",
  },
  {
    key: "city",
    title: "Город",
    isObject: true,
  },
  {
    key: "advertisment",
    title: "Объявления",
  },
  {
    key: "sex",
    title: "Пол",
  },
  {
    key: "age",
    title: "Возраст",
  },
  {
    key: "rating",
    title: "Рейтинг",
  },
  {
    key: "category",
    title: "Категория",
  },
  {
    key: "restriction",
    title: "Ограничения",
  },
];

const schema = y
  .object({
    label: y.string().required(),
    text: y.string().max(300).required(),
    link: y.string().required(),
    photo: y.mixed().required(),
  })
  .required();

type FormData = y.InferType<typeof schema>;

export default function ModerationPage() {
  const { data, isLoading } = useSWR("influencers", fetcher);
  const [isOpen, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  if (isLoading) return <Spinner />;

  const save = (data: FormData) => {};

  return (
    <div>
      <Header title={"Инфлюенсеры"} subTitle={"Информация"} />
      <Table
        control={{
          label: "Уведомление",
          action: () => setOpen(true),
        }}
        goTo={`/influencers`}
        data={data}
        labels={labels}
      />
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
                <Input
                  placeholder="Перенесите сюда файл"
                  {...register("photo")}
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
