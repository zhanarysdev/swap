"use client";
import { AddButton } from "@/components/button/add-button";
import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputButton } from "@/components/input/input-button";
import { InputLink } from "@/components/input/input-link";
import { InputPhone } from "@/components/input/input-phone";
import { InputTrash } from "@/components/input/input-trash";
import { Label } from "@/components/input/label";
import { Modal } from "@/components/modal/modal";
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
import { format } from "@react-input/mask";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import * as yup from "yup";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "totalInfluencers",
    title: "Участников",
  },
  {
    key: "spentBudget",
    title: "Бюджет",
  },
  {
    key: "startDate",
    title: "Создано",
  },
  {
    key: "endDate",
    title: "Срок",
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

const schema = yup
  .object({
    id: yup.string(),
    name: yup.string().required(),
    city: yup.string().required(),
    // advertisements: yup.string().required(),
    category: yup.array().of(yup.string()).required(),
    balance: yup.string().required(),
    contact: yup.string().required(),
    instagram: yup.string().required(),
    update: yup.string(),
    bin: yup.string().required(),
    phoneNumber: yup.string().required(),
    address: yup.string().required(),
    password: yup.string().required(),
    filials: yup
      .array()
      .of(yup.string().required("City is required"))
      .min(1, "At least one city is required"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function BusinesId() {
  const { id } = useParams();
  const [isEdit, setEdit] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    { url: `superadmin/v1/business/${id}`, custom: true },
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
  const categories = useSWR(
    {
      url: "business/category/list",
      data: {
        search: "",
        sort_by: "",
        sort_dir: "asc",
      },
    },
    post,
  );

  const [isOpen, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  const [isDelete, setDelete] = useState(false);

  const { context, setContext } = useContext(TableContext);

  const filials = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "filials" as never, // unique name for your Field Array
  });

  useEffect(() => {
    if (data?.result) {
      reset({
        ...data.result,
        city: data.result.city.id,
        category: data.result.categories.map((el) => el.id),
        filials: data.result.branches.map((el) => el.address),
        contact: data.result.displayNumber,
      });
    }
  }, [data, reset]);
  const { push } = useRouter();

  async function onRemove() {
    const res = await remove({
      url: `superadmin/v1/business/${id}`,
      custom: true,
    });
    setDelete(null);
    push("/busines");
  }

  async function save(data: FormSchemaType) {
    const res = await post({
      url: "superadmin/v1/business/update",
      custom: true,
      data: {
        address: data.address,
        bin: data.bin,
        branches: data.filials.map((el) => ({ address: el })),
        categories: data.category,
        cityId: data.city,
        displayNumber: data.contact,
        id: id,
        instagram: data.instagram,
        name: data.name,
        password: "string",
        phoneNumber: data.phoneNumber,
      },
    }); // Specify the collection and document ID
    if (res.result) {
      mutate();
      setEdit(false);
    }
  }

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
      }));
    }
  }, [data, setContext]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  if (isLoading || cities.isLoading || categories.isLoading) return <Spinner />;
  if (!data) {
    return null;
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-[64px]">
        <div>
          <Button
            preIcon={<Icon name="Caret" />}
            bg={ButtonBG.grey}
            label={"Назад"}
            onClick={() => push("/busines")}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            preIcon={<Icon name="Login" />}
            bg={ButtonBG.grey}
            label={"Войти как компания"}
          />
          <Button
            preIcon={<Icon name="TrashSmall" />}
            bg={ButtonBG.grey}
            label={"Удалить"}
            onClick={() => setDelete(true)}
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
        <h1 className="text-[36px] font-bold leading-[40px] mb-8"></h1>
        <form id="business-form" className="flex flex-col gap-6">
          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Название компании"} />
              <Input
                disabled={!isEdit}
                placeholder="Название"
                name="name"
                {...register("name")}
              />
              <FieldError error={errors.name?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Номер телефона"} />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => {
                  const cleaned = String(value).replace(/\D/g, "");
                  const formatted = format(cleaned, {
                    mask: "+7 (___) ___-___-__",
                    replacement: { _: /\d/ },
                  });
                  return (
                    <InputPhone
                      disabled={!isEdit}
                      value={formatted}
                      onChange={onChange}
                    />
                  );
                }}
                name="phoneNumber"
              />
              <FieldError error={errors.phoneNumber?.message} />
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label={"БИН"} />
              <Input
                placeholder="БИН"
                disabled={!isEdit}
                name="bin"
                {...register("bin")}
              />
              <FieldError error={errors.bin?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Номер телефона менеджера в приложении"} />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => {
                  const cleaned = String(value).replace(/\D/g, "");
                  const formatted = format(cleaned, {
                    mask: "+7 (___) ___-___-__",
                    replacement: { _: /\d/ },
                  });
                  return (
                    <InputPhone
                      disabled={!isEdit}
                      value={formatted}
                      onChange={onChange}
                    />
                  );
                }}
                name="contact"
              />
              <FieldError error={errors.contact?.message} />
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Категория бизнеса"} />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <MultiSelect
                      disabled={!isEdit}
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
              <FieldError error={errors.category?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label="Город" />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      disabled={!isEdit}
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
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label="Instagram" />
              <Input
                placeholder="Instagram"
                disabled={!isEdit}
                name="instagram"
                {...register("instagram")}
              />
              <FieldError error={errors.instagram?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label="Юредический адрес" />
              <Input
                disabled={!isEdit}
                placeholder="Юредический адрес"
                name="address"
                {...register("address")}
              />
              <FieldError error={errors.address?.message} />
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Баланс"} />
              <Input
                placeholder="Баланс"
                disabled={!isEdit}
                name="balance"
                {...register("balance")}
              />
              <FieldError error={errors.balance?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label="Адрес филиала" />
              <InputButton
                disabled={!isEdit}
                add={() => {
                  if (!filials.fields.length) {
                    filials.append("");
                  }
                  setOpen(true);
                }}
                placeholder="Адрес филиала"
                value={watch("filials") ? watch("filials").join(",") : ""}
              />
              <FieldError error={errors.name?.message} />
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full max-w-[450px]">
              <Label label={"Новый пароль"} />
              <Input
                placeholder="Новый пароль"
                type="password"
                disabled={!isEdit}
                name="password"
                {...register("password")}
              />
              <FieldError error={errors.name?.message} />
            </div>
          </div>
        </form>
        <div className="mt-[64px]">
          <h2 className="text-[24px] font-bold leading-7 mb-8">
            История объявлений
          </h2>
          <Table />
        </div>
      </div>

      {isOpen &&
        createPortal(
          <Modal
            label={"Филиалы"}
            close={() => setOpen(false)}
            onSave={() => setOpen(false)}
          >
            <div className="flex flex-col gap-[32px]">
              {filials.fields.map((el, index) => (
                <div key={el.id} className="flex flex-col gap-2 w-full">
                  <Label label={`Филиал #${index + 1}`} />
                  <InputTrash
                    remove={() => filials.remove(index)}
                    placeholder="Адрес"
                    {...register(`filials.${index}`)}
                  />
                  <FieldError error={errors.name?.message} />
                </div>
              ))}
              <AddButton onClick={() => filials.append("")} />
            </div>
          </Modal>,
          document.getElementById("page-wrapper"),
        )}
      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить "}
            close={() => setDelete(false)}
            onDelete={onRemove}
          />,
          document.getElementById("page-wrapper"),
        )}
    </div>
  );
}
