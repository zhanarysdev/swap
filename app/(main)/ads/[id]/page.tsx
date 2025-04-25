"use client";
import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { InputLink } from "@/components/input/input-link";
import { Label } from "@/components/input/label";
import { Modal } from "@/components/modal/modal";
import { ModalDelete } from "@/components/modal/modal-delete";
import { Preview } from "@/components/preview/preview";
import { Spinner } from "@/components/spinner/spinner";
import Table from "@/components/temp/table";
import { TableContext } from "@/components/temp/table-provider";
import { fetcher, post } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
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
    key: "influencer_fullname",
    title: "Имя",
  },
  {
    key: "instagram",
    title: "Instagram",
  },
  {
    key: "created_at",
    title: "Регистрация",
  },
  {
    key: "visit_date",
    title: "Дата посещения",
  },
  {
    key: "rating",
    title: "Рейтинг",
    rank: true,
  },
  {
    key: "status",
    title: "Статус",
    status: true,
  },
];

const schema = y
  .object({
    image: y.string().required("Oбязательное поле"),
    rank_bronze: y.string().required("Oбязательное поле"),
    rank_silver: y.string().required("Oбязательное поле"),
    rank_gold: y.string().required("Oбязательное поле"),
    rank_platinum: y.string().required("Oбязательное поле"),
    description: y.string().required("Oбязательное поле"),
    branch: y.string().required("Oбязательное поле"),
    created_at: y.string().required("Oбязательное поле"),
    restriction: y.string().required("Oбязательное поле"),
    budget: y.string().required("Oбязательное поле"),
    business_name: y.string().required("Oбязательное поле"),
    rating: y.string().required("Oбязательное поле"),
    instagram: y.string().required("Oбязательное поле"),
    phone: y.string().required("Oбязательное поле"),
    birthday: y.string().required("Oбязательное поле"),
    influencer_count: y.string().required("Oбязательное поле"),
    gender: y.string().required("Oбязательное поле"),
    city: y.string().required("Oбязательное поле"),
    category: y.string().required("Oбязательное поле"),
    is_bad_words_allowed: y.boolean().required("Oбязательное поле"),
    clothing_type: y.string().required("Oбязательное поле"),
    start_date: y.string().required("Oбязательное поле"),
    end_date: y.string().required("Oбязательное поле"),
    publication_type: y.string().required("Oбязательное поле"),
    ad_type: y.string().required("Oбязательное поле"),
  })
  .required();
type FormData = y.InferType<typeof schema>;

export default function AdsIdPage() {
  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const { context, setContext } = useContext(TableContext);
  const [isOpen, setOpen] = useState(false);
  const [showPreview, setPreview] = useState(false);

  const weekDaysMap: { [key: string]: string } = {
    'monday': 'Понедельник',
    'tuesday': 'Вторник',
    'wednesday': 'Среда',
    'thursday': 'Четверг',
    'friday': 'Пятница',
    'saturday': 'Суббота',
    'sunday': 'Воскресенье'
  };

  const { data, isLoading, mutate } = useSWR({ url: `tasks/${id}` }, fetcher);

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

  const archive = async () => {
    const res = await post({
      url: `task/archive/${id}`,
      data: { id: data.result.id },
    });
    if (res.result) {
      mutate();
    }
  };

  useEffect(() => {
    if (data?.result) {
      reset({
        ...data.result,
        branch: data.result.branches[0].address,
        budget: `${data.result.spent_budget} / ${data.result.budget} ₸`,
        influencer_count: data.result.influencer_amount,
        image: data.result.images[0],
        description: data.result.about,
        ad_type: data.result.content_type.format,
        rank_bronze: data.result.rewards.find((r) => r.rank === "bronze")
          ?.reward,
        rank_silver: data.result.rewards.find((r) => r.rank === "silver")
          ?.reward,
        rank_gold: data.result.rewards.find((r) => r.rank === "gold")?.reward,
        rank_platinum: data.result.rewards.find((r) => r.rank === "platinum")
          ?.reward,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    setContext((old) => ({
      ...old,
      data:
        data?.result.bookings.map((el) => ({
          ...el,
          created_at: new Date(el.created_at).toLocaleDateString(),
          visit_date: `${new Date(el.visit_date).toLocaleDateString()} ${el.start_time} - ${el.end_time} `,
          //there should be ranks
          rating: el.influencer_rank,
        })) ?? [],
      pure: true,
      labels: labels,
      number: true,
    }));
  }, [data]);

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
            onClick={() => push("/ads")}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            preIcon={<Icon name="Calendar" />}
            bg={ButtonBG.grey}
            onClick={() => setOpen(true)}
            label={"График посещения"}
          />
          <Button
            preIcon={<Icon name="Archive" />}
            bg={ButtonBG.grey}
            onClick={() => archive()}
            label={"Архивировать"}
          />
          <Button
            preIcon={<Icon name={"Eye"} />}
            bg={ButtonBG.grey}
            label={"Предпросмотр"}
            onClick={() => setPreview(true)}
          />
        </div>
      </div>

      <h1 className="text-[36px] font-bold leading-[40px] mb-8">
        {watch("business_name")}
      </h1>
      <form className="flex gap-[42px]">
        <div className="flex flex-col gap-6 w-full">
          <div
            className={`bg-lightGrey w-full h-[288px] rounded-2xl flex ${watch("image") ? "bg-cover bg-center" : ""}`}
            style={{ backgroundImage: `url(${watch("image")})` }}
          ></div>
          <div className="flex flex-col gap-2">
            <Label label={"Вознаграждение для бронзового инфлюэнсера"} />
            <InputLink label={watch("rank_bronze")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Вознаграждение для серебряного инфлюэнсера"} />
            <InputLink label={watch("rank_silver")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Вознаграждение для золотого инфлюэнсера"} />
            <InputLink label={watch("rank_gold")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Вознаграждение для платинового инфлюэнсера"} />
            <InputLink label={watch("rank_platinum")} />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <Label label={"Описание"} />
            <InputLink label={watch("description")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Филиалы"} />
            <InputLink label={watch("branch")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Текст для рекламы"} />
            <InputLink label={watch("description")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Ненормативная лексика"} />
            <InputLink
              label={
                watch("is_bad_words_allowed") ? "Допустима" : "Не допустима"
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <Label label={"Создано"} />
            <InputLink
              label={new Date(watch("created_at")).toLocaleDateString()}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Бюджет"} />
            <InputLink label={watch("budget")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Одежда"} />
            <InputLink label={watch("clothing_type")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Инфлюенсеров "} />
            <InputLink label={watch("influencer_count")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Период"} />
            <InputLink
              label={`${new Date(watch("start_date")).toLocaleDateString()} - ${new Date(watch("end_date")).toLocaleDateString()}`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Тип"} />
            <InputLink label={watch("publication_type")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Формат"} />
            <InputLink label={watch("ad_type")} />
          </div>
        </div>
      </form>
      <div className="mt-[64px]">
        <h2 className="text-[24px] font-bold leading-7 mb-8">
          История объявлений
        </h2>
        <Table />
      </div>
      {isOpen &&
        createPortal(
          <Modal label="График посещения" close={() => setOpen(false)}>
            <div className="flex flex-col gap-2">
              {data.result.work_hours.map((el) => {
                return (
                  <div
                    key={el.week_day}
                    className="flex justify-between bg-[#383838] rounded-2xl py-[9px] items-center px-[25px]"
                  >
                    <div>{weekDaysMap[el.week_day.toLowerCase()] || el.week_day}</div>
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#212121] px-3 py-2 rounded-2xl">
                        {el.open_time}
                      </div>
                      -
                      <div className="bg-[#212121] px-3 py-2 rounded-2xl">
                        {el.close_time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Modal>,
          document.getElementById("page-wrapper"),
        )}
      {showPreview &&
        createPortal(
          <Preview
            img={data.result.images[0]}
            close={() => setPreview(false)}
            end_date={data.result.end_date}
            publication_type={data.result.content_type.format}
            business_name={data.result.business_name}
            reward={data.result.rewards.find((r) => r.rank === "platinum").reward}
          />,
          document.getElementById("page-wrapper"),
        )}
      {isDelete &&
        createPortal(
          <ModalDelete label={"Удалить "} close={() => setDelete(false)} />,
          document.getElementById("page-wrapper"),
        )}
    </div>
  );
}
