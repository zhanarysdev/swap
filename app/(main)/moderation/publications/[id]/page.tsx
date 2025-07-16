
"use client";
import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { InputLink } from "@/components/input/input-link";
import { Label } from "@/components/input/label";
import { ModalDelete } from "@/components/modal/modal-delete";
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
    image: y.string().optional(),
    rank_bronze: y.string().optional(),
    rank_silver: y.string().optional(),
    rank_gold: y.string().optional(),
    rank_platinum: y.string().optional(),
    about: y.string().optional(),
    branch: y.string().optional(),
    budget: y.string().optional(),
    business_name: y.string().optional(),
    influencer_count: y.string().optional(),
    is_bad_words_allowed: y.boolean().optional(),
    clothing_type_id: y.string().optional(),
    start_date: y.string().optional(),
    end_date: y.string().optional(),
    publication_type: y.string().optional(),
    ad_format: y.string().optional(),
    created_at: y.string().optional(),
  })
  .required();
type FormData = y.InferType<typeof schema>;

export default function ModerationPublicationsIdPage() {
  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const { context, setContext } = useContext(TableContext);

  const { data, isLoading, mutate } = useSWR({ url: `tasks/${id}` }, fetcher);
  const { data: ranksData } = useSWR({ url: `rank/list`, data: { search: "" } }, post);

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
    if (data && ranksData) {
      const ranks = ranksData.result || [];
      console.log("Available ranks:", ranks);
      console.log("Rewards by rank:", data.rewards_by_rank);

      reset({
        ...data,
        branch: data.branches[0]?.address,
        budget: `${data.spent_budget} / ${data.budget} ₸`,
        influencer_count: data.influencer_amount,
        rank_bronze: data.rewards_by_rank.find(r => {
          const rank = ranks.find(rankItem => rankItem.id === r.rank_id);
          return rank?.name?.toLowerCase().includes('bronze');
        })?.reward,
        rank_silver: data.rewards_by_rank.find(r => {
          const rank = ranks.find(rankItem => rankItem.id === r.rank_id);
          return rank?.name?.toLowerCase().includes('silver');
        })?.reward,
        rank_gold: data.rewards_by_rank.find(r => {
          const rank = ranks.find(rankItem => rankItem.id === r.rank_id);
          return rank?.name?.toLowerCase().includes('gold');
        })?.reward,
        rank_platinum: data.rewards_by_rank.find(r => {
          const rank = ranks.find(rankItem => rankItem.id === r.rank_id);
          return rank?.name?.toLowerCase().includes('platinum');
        })?.reward,
        image: data.images[0]?.image
      });
    }
  }, [data, ranksData, reset]);
  const { back } = useRouter();
  const logs = useSWR({ url: `moderation/tasks/${id}` }, fetcher);

  console.log("========", data)
  console.log("Ranks data:", ranksData)

  useEffect(() => {
    setContext(old => ({
      ...old, data: data?.bookings.map((el) => ({
        ...el, created_at: new Date(el.created_at).toLocaleDateString(),
        visit_date: `${new Date(el.visit_date).toLocaleDateString()} ${el.start_time} - ${el.end_time} `
        //there should be ranks
        , rating: el.influencer_rank
      })) ?? [], pure: true, labels: labels, number: true
    }))
  }, [data])



  if (isLoading) return <Spinner />;

  const accept = async () => {
    const res = await post({ url: `moderation/tasks/${id}/moderate`, data: { status: 'approved' } });
    if (res.statusCode === 200) {
      push("/moderation/publications");
    }
  }
  const retry = async () => {
    const res = await post({ url: `moderation/tasks/${id}/moderate`, data: { status: 'needs_fixes' } });
    if (res.statusCode === 200) {
      push("/moderation/publications");
    }
  }

  const reject = async () => {
    const res = await post({ url: `moderation/tasks/${id}/moderate`, data: { status: 'rejected' } });
    if (res.statusCode === 200) {
      push("/moderation/publications");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-[64px]">
        <div className="flex gap-6 items-center">
          <Button
            preIcon={<Icon name="Caret" />}
            bg={ButtonBG.grey}
            label={"Назад"}
            onClick={() => push("/moderation/publications")}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            bg={ButtonBG.primary}
            label={"Одобрить"}
            onClick={accept}
          />
          <Button
            bg={ButtonBG.orange}
            label={"Запросить повторно"}
            onClick={retry}
          />
          <Button
            bg={ButtonBG.red}
            label={"Отклонить"}
            onClick={reject}
          />
        </div>
      </div>

      <h1 className="text-[36px] font-bold leading-[40px] mb-8">
        {watch("business_name")}
      </h1>
      <form className="flex gap-[42px]">
        <div className="flex flex-col gap-6 w-full">
          <div className={`bg-lightGrey w-full h-[288px] rounded-2xl flex ${watch("image") ? "bg-cover bg-center" : ""}`} style={{ backgroundImage: `url(${watch("image")})` }}></div>
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
            <InputLink label={watch("about")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Филиалы"} />
            <InputLink label={watch("branch")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Текст для рекламы"} />
            <InputLink label={watch("about")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Ненормативная лексика"} />
            <InputLink label={watch("is_bad_words_allowed") ? "Допустима" : "Не допустима"} />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <Label label={"Создано"} />
            <InputLink label={new Date(watch("created_at")).toLocaleDateString()} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Бюджет"} />
            <InputLink label={watch("budget")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Одежда"} />
            <InputLink label={watch("clothing_type_id")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Инфлюенсеров "} />
            <InputLink label={watch("influencer_count")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Период"} />
            <InputLink label={`${new Date(watch("start_date")).toLocaleDateString()} - ${new Date(watch("end_date")).toLocaleDateString()}`} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Тип"} />
            <InputLink label={watch("publication_type")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label label={"Формат"} />
            <InputLink label={watch("ad_format")} />
          </div>
        </div>

      </form>
      <div className="mt-[64px]">
        <h2 className="text-[24px] font-bold leading-7 mb-8">
          История объявлений
        </h2>
        <Table />
      </div>
      {isDelete &&
        createPortal(
          <ModalDelete label={"Удалить "} close={() => setDelete(false)} />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
