"use client";

import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputCalendar } from "@/components/input/input-calendar";
import { InputLink } from "@/components/input/input-link";
import { InputPhone } from "@/components/input/input-phone";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
import { Select } from "@/components/select/select";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import * as y from "yup";
import { Text } from "@/components/input/text";
import { InputFile } from "@/components/input/input-file";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "company",
    title: "Компания",
  },
  {
    key: "members",
    title: "Участников",
  },
  {
    key: "budget",
    title: "Бюджет",
  },
  {
    key: "type",
    title: "Тип",
    rounded: true,
  },
  {
    key: "format",
    title: "Формат",
    rounded: true,
  },
  {
    key: "status",
    title: "Статус",
    status: true,
  },
];

const schema = y
  .object({
    restriction: y.string().required("Oбязательное поле"),
    name: y.string().required("Oбязательное поле"),
    rating: y.string().required("Oбязательное поле"),
    instagram: y.string().required("Oбязательное поле"),
    phone: y.string().required("Oбязательное поле"),
    birthday: y.string().required("Oбязательное поле"),
    gender: y.string().required("Oбязательное поле"),
    city: y.string().required("Oбязательное поле"),
    category: y.string().required("Oбязательное поле"),
  })
  .required();
type FormData = y.InferType<typeof schema>;

export default function InfluencersId() {
  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);

  const advertisement = useSWR("advertisment", fetcher);

  const { data, isLoading } = useSWR(`influencers/${id}`, fetcher);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data && data[0]) {
      reset({ ...data[0], ...{ city: data[0].city.name } });
    }
  }, [data, reset]);

  if (isLoading || advertisement.isLoading) return <Spinner />;

  const save = async (data: FormData) => {
    console.log(data);
  };
  const link = watch("instagram")?.split("@");

  return (
    <div>
      <div className="flex justify-between items-center mb-[64px]">
        <Button
          preIcon={<Icon name="Caret" />}
          bg={ButtonBG.grey}
          label={"Назад"}
          onClick={() => push("/influencers")}
        />
        <div className="flex items-center gap-4">
          <Button
            preIcon={<Icon name="Login" />}
            bg={ButtonBG.grey}
            label={"Войти как компания"}
          />
          <Button
            preIcon={<Icon name="TrashSmall" />}
            bg={ButtonBG.grey}
            onClick={() => setDelete(true)}
            label={"Удалить"}
          />
          <Button
            preIcon={<Icon name={isEdit ? "Save" : "Pencil"} />}
            bg={ButtonBG.grey}
            label={isEdit ? "Cохранить" : "Изменить"}
            onClick={!isEdit ? () => setEdit(true) : handleSubmit(save)}
          />
        </div>
      </div>
      <div>
        <h1 className="text-[36px] font-bold leading-[40px] mb-8">
          История уведомления
        </h1>
        <form className="flex gap-[42px]">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <Label label={"Заголовок"} />
              <Input placeholder="Заголовок" />
            </div>
            <div className="flex flex-col gap-2">
              <Label label={"Категория инфлюенсера"} />
              <Text
                placeholder="Категория инфлюенсера"
                count={0}
                maxCount={300}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label label={"Ссылка"} />
              <Input placeholder="Ссылка" />
            </div>
            <div className="flex flex-col gap-2">
              <Label label={"Фото"} />
              <InputFile value={""} onChange={undefined} placeholder="Фото" />
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <Label label={"Фильтр"} />
              <Input placeholder="Фильтр" />
            </div>
            <div className="flex flex-col gap-2">
              <Label label={"Время"} />
              <Input placeholder="Время" />
            </div>
            <div className="flex flex-col gap-2">
              <Label label={"Количество"} />
              <Input placeholder="Количество" />
            </div>
          </div>
        </form>
      </div>

      <div className="mt-[64px]">
        <h2 className="text-[24px] font-bold leading-7 mb-8">
          История объявлений
        </h2>
        <Table
          data={advertisement.data}
          filters={false}
          labels={labels}
          number
          goTo="/advertisments"
        />
      </div>
      {isDelete &&
        createPortal(
          <ModalDelete label={"Удалить "} close={() => setDelete(false)} />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
