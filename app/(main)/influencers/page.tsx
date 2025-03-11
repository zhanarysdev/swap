"use client";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputFile } from "@/components/input/input-file";
import { Label } from "@/components/input/label";
import { Text } from "@/components/input/text";
import { ModalSave } from "@/components/modal/modal-save";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { TableContext } from "@/components/table/table-context";
import { fetcher } from "@/fetcher";
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
  },
  {
    key: "advertisment",
    title: "Объявления",
  },
  {
    key: "gender",
    title: "Пол",
  },
  {
    key: "age",
    title: "Возраст",
  },
  {
    key: "rank",
    title: "Рейтинг",
  },
  {
    key: "category",
    title: "Категория",
    rounded: true,
  },
  {
    key: "restriction_ad",
    title: "Ограничения",
  },
];

const sort = ["name", "city", "sex", "age", "status", "category"];

const schema = y
  .object({
    label: y.string().required("Oбязательное поле"),
    text: y.string().max(300).required("Oбязательное поле"),
    link: y.string().required("Oбязательное поле"),
    photo: y.string().required("Oбязательное поле"),
  })
  .required();

type FormData = y.InferType<typeof schema>;

export default function ModerationPage() {
  const [isOpen, setOpen] = useState(false);

  const { tableData, setTableData } = useContext(TableContext);
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading, mutate } = useSWR(
    { url: `influencer/list?page=1&page_size=10` },
    fetcher
  );

  useEffect(() => {
    setTableData({ isLoading: isLoading });
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setFilteredData(data.result.items);
    }
  }, [data]);

  const {
    handleSubmit,
    register,
    watch,
    control,
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
          label: "Отправить уведомление",
          action: () => setOpen(true),
        }}
        sort={sort}
        goTo={`/influencers`}
        data={filteredData}
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
                      value={value}
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
