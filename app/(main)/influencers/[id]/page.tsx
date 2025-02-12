"use client";

import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputCalendar } from "@/components/input/input-calendar";
import { InputLink } from "@/components/input/input-link";
import { InputPhone } from "@/components/input/input-phone";
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

  if (isLoading) return <Spinner />;

  const save = async (data: FormData) => {
    console.log(data);
  };
  const link = watch("instagram")?.split("@");

  return (
    <div>
      <div className="flex justify-between items-center mb-[64px]">
        <div className="flex gap-6 items-center">
          <Button
            preIcon={<Icon name="Caret" />}
            bg={ButtonBG.grey}
            label={"Назад"}
            onClick={() => push("/influencers")}
          />
          <span className="text-grey font-bold text-base leading-5">
            Регистрация: 12.04.2024
          </span>
        </div>
        <div className="flex items-center gap-4">
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
      <form className="flex gap-[42px]">
        <div className="flex flex-col gap-6 w-full">
          <div className="bg-lightGrey w-full h-[288px] rounded-2xl flex"></div>
          <div>
            {!isEdit ? (
              <InputLink
                label={watch("instagram")}
                value={`https://www.instagram.com/${link ? link[1] : ""}`}
              />
            ) : (
              <>
                <Input placeholder="Instagram" {...register("instagram")} />
                <FieldError error={errors.instagram?.message} />
              </>
            )}
          </div>
          <div>
            {!isEdit ? (
              <InputLink label={watch("rating")} />
            ) : (
              <>
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <Select
                      data={value ? value : "Рейтинг"}
                      options={[{ value: "Серебро", label: "Серебро" }]}
                      onChange={onChange}
                    />
                  )}
                  control={control}
                  name={"rating"}
                />
                <FieldError error={errors.rating?.message} />
              </>
            )}
          </div>
          <div className="text-grey font-bold text-base leading-5">
            Обновлен: 12.04.2024
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div>
            {!isEdit ? (
              <InputLink label={watch("name")} />
            ) : (
              <>
                <Input placeholder="Имя" {...register("name")} />
                <FieldError error={errors.name?.message} />
              </>
            )}
          </div>
          <div>
            {!isEdit ? (
              <InputLink label={watch("phone") ? watch("phone") : "Номер"} />
            ) : (
              <>
                <InputPhone {...register("phone")} />
                <FieldError error={errors.phone?.message} />
              </>
            )}
          </div>
          <div>
            {!isEdit ? (
              <InputLink
                label={watch("birthday") ? watch("birthday") : "Год рождения"}
              />
            ) : (
              <>
                <InputCalendar
                  placeholder="Год рождения"
                  {...register("birthday")}
                />
                <FieldError error={errors.name?.message} />
              </>
            )}
          </div>
          <div>
            {!isEdit ? (
              <InputLink label={watch("gender") ? watch("gender") : "Пол"} />
            ) : (
              <>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      data={value ? value : "Пол"}
                      options={[
                        { value: "Мужчина", label: "Мужчина" },
                        { value: "Женшина", label: "Женшина" },
                      ]}
                      onChange={onChange}
                    />
                  )}
                />
                <FieldError error={errors.gender?.message} />
              </>
            )}
          </div>
          <div>
            {!isEdit ? (
              <InputLink label={watch("city") ? watch("city") : "Город"} />
            ) : (
              <>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      data={value ? value : "Город"}
                      onChange={onChange}
                      options={[{ value: "Алматы", label: "Алматы" }]}
                    />
                  )}
                />
                <FieldError error={errors.city?.message} />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div>
            {!isEdit ? (
              <InputLink
                label={watch("category") ? watch("category") : "Категория"}
              />
            ) : (
              <>
                <Controller
                  name="category"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      data={value ? value : "Категория"}
                      onChange={onChange}
                      options={[
                        { value: "bar", label: "bar" },
                        { value: "ba1", label: "ba1" },
                        { value: "ba2", label: "ba2" },
                        { value: "ba3", label: "ba3" },
                      ]}
                    />
                  )}
                />
                <FieldError error={errors.restriction?.message} />
              </>
            )}
          </div>
          <div>
            {!isEdit ? (
              <InputLink
                label={
                  watch("restriction")
                    ? watch("restriction")
                    : "Ограничения (Да / Нет)"
                }
              />
            ) : (
              <>
                <Controller
                  name="restriction"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      data={value ? value : "Ограничения (Да / Нет)"}
                      onChange={onChange}
                      options={[
                        { value: "Да", label: "Да" },
                        { value: "Нет", label: "Нет" },
                      ]}
                    />
                  )}
                />
                <FieldError error={errors.restriction?.message} />
              </>
            )}
          </div>
        </div>
      </form>
      <div className="mt-[64px]">
        <h2 className="text-[24px] font-bold leading-7 mb-8">
          История объявлений
        </h2>
        <Table
          data={[
            {
              id: 0,
              company: "Gippo",
              members: "5/7",
              budget: "25000 / 30000",
              type: "Reels",
              format: "Video",
              status: "Активно",
            },
          ]}
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
