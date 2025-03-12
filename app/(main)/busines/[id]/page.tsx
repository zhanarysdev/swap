"use client";
import { AddButton } from "@/components/button/add-button";
import { Button, ButtonBG } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { InputButton } from "@/components/input/input-button";
import { InputTrash } from "@/components/input/input-trash";
import { Label } from "@/components/input/label";
import { Modal } from "@/components/modal/modal";
import { Select } from "@/components/select/select";
import { Spinner } from "@/components/spinner/spinner";
import { Table } from "@/components/table/table";
import { fetcher } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

const labels = [
  {
    key: "id",
    title: "ID",
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
    key: "created",
    title: "Создано",
    timeStamp: true,
  },
  {
    key: "deadline",
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
    advertisements: yup.string().required(),
    category: yup.string().required(),
    balance: yup.string().required(),
    contact: yup.string().required(),
    instagram: yup.string().required(),
    update: yup.string(),
    bin: yup.string().required(),
    phoneNumber: yup.string().required(),
    address: yup.string().required(),
    filials: yup
      .array()
      .of(yup.string().required("City is required"))
      .min(1, "At least one city is required"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function BusinesId() {
  const { id } = useParams();
  const { data, isLoading } = useSWR(
    { url: `superadmin/v1/business/${id}`, custom: true },
    fetcher
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
  console.log(data);

  const filials = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "filials" as never, // unique name for your Field Array
  });

  useEffect(() => {
    if (data?.result) {
      reset({ ...data.result });
    }
  }, [data, reset]);
  const { back } = useRouter();

  if (isLoading) return <Spinner />;

  function save(data: FormSchemaType) {
    console.log("asldjkl");
    console.log(data);
  }

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
            onClick={back}
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
          />
          <Button
            preIcon={<Icon name="Save" />}
            bg={ButtonBG.grey}
            label={"Cохранить"}
            onClick={handleSubmit(save)}
          />
        </div>
      </div>
      <div>
        <h1 className="text-[36px] font-bold leading-[40px] mb-8"></h1>
        <form
          id="business-form"
          onSubmit={handleSubmit(save)}
          className="flex flex-col gap-6"
        >
          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Название компании"} />
              <Input placeholder="Название" name="name" {...register("name")} />
              <FieldError error={errors.name?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Номер телефона"} />
              <Input
                disabled
                placeholder="Номер телефона"
                name="phone"
                {...register("phoneNumber")}
              />
              <FieldError error={errors.phoneNumber?.message} />
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label={"БИН"} />
              <Input
                disabled
                placeholder="БИН"
                name="bin"
                {...register("bin")}
              />
              <FieldError error={errors.bin?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label={"Номер телефона менеджера в приложении"} />
              <Input
                placeholder="Номер телефона менеджера в приложении"
                name="contact"
                {...register("contact")}
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
                    <Select
                      data={value ? value : "Категория бизнеса"}
                      options={[
                        { label: "бар", value: "бар" },
                        { label: "общепит", value: "общепит" },
                      ]}
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
              {/* <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    data={value ? value : "Город"}
                    options={cities.data.map((el: any) => ({
                      label: el.name,
                      value: el.name,
                    }))}
                    onChange={onChange}
                  />
                )}
                name={"city"}
              /> */}
              <FieldError error={errors.city?.message} />
            </div>
          </div>

          <div className="flex gap-12 max-w-[948px] w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label label="Instagram" />
              <Input
                disabled
                placeholder="Instagram"
                name="instagram"
                {...register("instagram")}
              />
              <FieldError error={errors.instagram?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label="Юредический адрес" />
              <Input
                disabled
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
                disabled
                placeholder="Баланс"
                name="balance"
                {...register("balance")}
              />
              <FieldError error={errors.balance?.message} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label label="Адрес филиала" />
              <InputButton
                disabled
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
                disabled
                placeholder="Новый пароль"
                name="name"
                {...register("name")}
              />
              <FieldError error={errors.name?.message} />
            </div>
          </div>
        </form>
        <div className="mt-[64px]">
          <h2 className="text-[24px] font-bold leading-7 mb-8">
            История объявлений
          </h2>
          {/* <Table
            data={advertisement.data}
            filters={false}
            labels={labels}
            number
            goTo="/advertisments"
          /> */}
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
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
