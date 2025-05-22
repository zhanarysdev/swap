"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputFile } from "@/components/input/input-file";
import { Label } from "@/components/input/label";
import { Text } from "@/components/input/text";
import { ModalSave } from "@/components/modal/modal-save";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { post, postFile } from "@/fetcher";
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
    gender: true,
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

const sort = ["fullname", "city", "gender", "age", "status", "category"];

const schema = y
  .object({
    // Notification fields
    label: y.string().required("Oбязательное поле"),
    text: y.string().max(300).required("Oбязательное поле"),
    link: y.string().optional(),
    photo: y
      .mixed<File>()
      .optional(),
    // Influencer fields
    age: y.string().optional(),
    category_ids: y.array().of(y.string()).optional(),
    city_id: y.string().optional(),
    fullname: y.string().optional(),
    gender: y.string().optional(),
    instagram: y.string().optional(),
    number: y.string().optional(),
    restricted_ad: y.boolean().optional(),
  })
  .required();

type FormData = y.InferType<typeof schema>;

export default function ModerationPage() {
  const [isOpen, setOpen] = useState(false);

  const [isSending, setSending] = useState(false);

  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `influencer/list`,
      data: {
        page: 1,
        search: debouncedSearch,
        sort_by: context.sortValue?.key,
        sort_direction: context.sortValue?.direction,
        category_id: context.filterValue.category,
        city_id: context.filterValue.city,
        gender: context.filterValue.gender,
        max_age: context.filterValue.max_age
          ? context.filterValue.max_age
          : 100,
        min_age: context.filterValue.min_age ? context.filterValue.min_age : 0,
        rank_id: context.filterValue.rank,
      },
    },
    post,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    },
  );

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);


  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result.items
          ? data.result.items.map((el) => ({
              ...el,
              category: el.categories,
              rank: el.rank,
              advertisment: `${el.completed_visit_count} / ${el.cancelled_visit_count}`,
              age: el.birthday
                ? (() => {
                    try {
                      let date;
                      if (el.birthday.includes(".")) {
                        // Handle "DD.MM.YYYY" format
                        const [day, month, year] = el.birthday.split(".");
                        date = new Date(
                          parseInt(year),
                          parseInt(month) - 1,
                          parseInt(day),
                        );
                      } else {
                        // Handle "YYYY-MM-DD HH:mm:ss.SSS" format
                        date = new Date(el.birthday.split(" ")[0]);
                      }

                      if (isNaN(date.getTime())) {
                        return "";
                      }

                      const age = new Date().getFullYear() - date.getFullYear();
                      return age > 0 ? age : "";
                    } catch (error) {
                      return "";
                    }
                  })()
                : "",
            }))
          : [],
        labels: labels,
        goTo: "/influencers",
        sort: sort,
        sortByTwoDirection: true,
        filters: ["city", "category", "gender", "rank"],
        control: {
          label: "Отправить уведомление",
          action: () => setOpen(true),
          disabled: "checked",
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
    setError,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      label: "",
      text: "",
      link: "",
      age: "",
      category_ids: [],
      city_id: "",
      fullname: "",
      gender: "",
      instagram: "",
      number: "",
      restricted_ad: false,
    },
  });

  const save = async (data: FormData) => {
    if (context.checked.length === 0) {
      setError("root", { message: "Выберите пользователей" });
      return false;
    }
    try {
      // First, send the notification
      const notificationFormData = new FormData();
      notificationFormData.append("user_ids", context.checked.join(","));
      notificationFormData.append("message", data.text || "");
      notificationFormData.append("from", data.label || "");
      notificationFormData.append("navigate", data.link || "");
      notificationFormData.append("link", data.link || "");
      notificationFormData.append("image", data.photo);
      setSending(true);

      const res = await postFile({
        url: "notification/send",
        data: notificationFormData,
      });
      if (res.result) {
        setOpen(false);
        setSending(false);
        reset();
      }
    } catch (error) {
      console.error("Error updating influencers:", error);
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
            disabled={isSending}
            label={"Отправка уведомления"}
            close={() => {
              setOpen(false);
              reset();
            }}
            buttonLabel="Отправить"
          >
            <div className="flex flex-col gap-4">
              <FieldError error={errors.root?.message} />
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
                      value={value || null}
                      onChange={onChange}
                    />
                  )}
                />
                <FieldError error={errors.photo?.message} />
              </div>
            </div>
          </ModalSave>,
          document.getElementById("page-wrapper"),
        )}
    </div>
  );
}
