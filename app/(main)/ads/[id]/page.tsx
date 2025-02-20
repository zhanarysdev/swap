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
import { Table } from "@/components/table/table";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import * as y from "yup";

const labels = [
  {
    key: "name",
    title: "Имя",
  },
  {
    key: "instagram",
    title: "Instagram",
  },
  {
    key: "registration",
    title: "Регистрация",
  },
  {
    key: "date",
    title: "Дата посещения",
  },
  {
    key: "rating",
    title: "Рейтинг",
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

export default function AdsIdPage() {
  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);

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
        </div>
        <div className="flex items-center gap-4">
          <Button
            preIcon={<Icon name="Calendar" />}
            bg={ButtonBG.grey}
            onClick={() => setDelete(true)}
            label={"График посещения"}
          />
          <Button
            preIcon={<Icon name="Archive" />}
            bg={ButtonBG.grey}
            onClick={() => setDelete(true)}
            label={"Архивировать"}
          />
          <Button
            preIcon={<Icon name={"Eye"} />}
            bg={ButtonBG.grey}
            label={"Предпросмотр"}
            onClick={!isEdit ? () => setEdit(true) : handleSubmit(save)}
          />
        </div>
      </div>

      <h1 className="text-[36px] font-bold leading-[40px] mb-8">Gippo</h1>
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
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <InputCalendar
                      placeholder="Год рождения"
                      onChange={onChange}
                      value={value}
                    />
                  )}
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
