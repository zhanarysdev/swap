"use client";

import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputCalendar } from "@/components/input/input-calendar";
import { InputLink } from "@/components/input/input-link";
import { InputPhone } from "@/components/input/input-phone";
import { ModalDelete } from "@/components/modal/modal-delete";
import { MultiSelect } from "@/components/select/multi-select";
import { Select } from "@/components/select/select";
import { Spinner } from "@/components/spinner/spinner";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { edit, fetcher, post, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
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
    key: "business_name",
    title: "Компания",
  },
  {
    key: "influencer_amount",
    title: "Участников",
  },
  {
    key: "budget",
    title: "Бюджет",
  },
  {
    key: "publication_type",
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
    image: y.string().required("Oбязательное поле"),
    rating: y.string().required("Oбязательное поле"),
    instagram: y.string().required("Oбязательное поле"),
    phone: y.string().required("Oбязательное поле"),
    birthday: y.string().required("Oбязательное поле"),
    gender: y.string().required("Oбязательное поле"),
    city: y.string().required("Oбязательное поле"),
    category: y.array().of(y.string()).required(),
  })
  .required();
type FormData = y.InferType<typeof schema>;

export default function InfluencersId() {
  const { push } = useRouter();

  const { id } = useParams();
  const [isEdit, setEdit] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    { url: `influencer/${id}` },
    fetcher,
  );

  const cities = useSWR(
    {
      url: `city/count`,
      data: {
        search: "",
        sort_by: "name",
        sort_dir: "asc",
      },
    },
    post,
  );
  const categories = useSWR({ url: "categories" }, fetcher);

  const [isOpen, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [isDelete, setDelete] = useState(false);

  const { context, setContext } = useContext(TableContext);

  useEffect(() => {
    if (data?.result) {
      reset({
        ...data.result,
        city: data.result.city.id,
        category: data.result.categories.map((el) => el.id),
        contact: data.result.displayNumber,
        rating: data.result.rank.name,
        name: data.result.fullname,
        phone: data.result.number,
        restriction: data.result.restricted_ad ? "Да" : "Нет",
      });
    }
  }, [data, reset]);

  async function save(data: FormData) {
    const res = await edit({
      url: `influencer/${id}`,
      data: {
        birthday: data.birthday,
        category_ids: data.category,
        city_id: data.city,
        fullname: data.name,
        gender: data.gender,
        instagram: data.instagram,
        number: data.phone,
        restricted_ad: data.restriction === "Да" ? true : false,
      },
    }); // Specify the collection and document ID
    if (res.result) {
      mutate();
      setEdit(false);
    }
  }
  const link = watch("instagram")?.split("@");
  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result.tasks,
        labels: labels,
        goTo: "/ads",
        pure: true,
        number: true,
      }));
    }
  }, [data, setContext]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);
  if (isLoading) return <Spinner />;
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
            Регистрация:{" "}
            {new Date(data?.result?.created_at).toLocaleDateString()}
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
          <img
            className={`bg-lightGrey w-full h-[288px] rounded-2xl flex object-cover`}
            src={data?.result?.image}
          />
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
              <InputLink
                label={
                  watch("rating") === "silver"
                    ? "Серебро"
                    : watch("rating") === "gold"
                      ? "Золото"
                      : "Бронза"
                }
              />
            ) : (
              <>
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <Select
                      data={value ? value : "Рейтинг"}
                      options={[
                        { value: "silver", label: "Серебро" },
                        { value: "gold", label: "Золото" },
                        { value: "bronze", label: "Бронза" },
                      ]}
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
            Обновлен: {new Date(data?.result?.updated_at).toLocaleDateString()}
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
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <InputPhone {...field} />}
                />
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
              <InputLink
                label={
                  watch("gender") === "male"
                    ? "Мужчина"
                    : watch("gender") === "female"
                      ? "Женшина"
                      : "Пол"
                }
              />
            ) : (
              <>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      data={value ? value : "Пол"}
                      options={[
                        { value: "male", label: "Мужчина" },
                        { value: "female", label: "Женшина" },
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
              <InputLink
                label={
                  cities.data?.result.find((el) => el.id === watch("city"))
                    ?.name
                }
              />
            ) : (
              <>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Select
                        data={value ? value : "Город"}
                        options={cities.data?.result.map((el: any) => {
                          return {
                            label: el.name,
                            value: el.id,
                          };
                        })}
                        onChange={onChange}
                      />
                    );
                  }}
                  name={"city"}
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
                label={watch("category")
                  ?.map(
                    (val) =>
                      categories.data?.result.find((el) => el.id === val)?.name,
                  )
                  .filter(Boolean)
                  .join(", ")}
              />
            ) : (
              <>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <MultiSelect
                        data={value ? value : ["Категория бизнеса"]}
                        options={categories.data?.result.map((el) => ({
                          label: el.name,
                          value: el.id,
                        }))}
                        onChange={onChange}
                      />
                    );
                  }}
                  name={"category"}
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
        <h2 className="text-[24px] font-bold leading-7 mb-8">Посещения 5/2</h2>
        <Table />
      </div>
      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить "}
            close={() => setDelete(false)}
            onDelete={() => {
              edit({ url: `influencer/${id}/delete`, data: { id: isDelete } });
              setDelete(false);
              push("/influencers");
            }}
          />,
          document.getElementById("page-wrapper"),
        )}
    </div>
  );
}
