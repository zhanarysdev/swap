"use client";

import { Button } from "@/components/button/button";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as y from "yup";
import { InferType } from "yup";

const schema = y
  .object({
    username: y.string().required(),
    password: y.string().required(),
  })
  .required();

type FormData = InferType<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { push } = useRouter();

  const submit = async (data: FormData) => {
    const res = await fetch("https://swapp.kz/api/v1/superadmin/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (res?.statusCode === 200) {
      localStorage?.setItem("token", res.result);
      push("/busines");
    } else {
      setError("root", { message: "Неправильный логин или пароль" });
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form
        className="flex flex-col gap-4 max-w-[460px] w-full"
        onSubmit={handleSubmit(submit)}
      >
        <FieldError error={errors?.root?.message} />
        <div className="flex flex-col gap-2">
          <Input placeholder="Логин" {...register("username")} />
          <FieldError />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Пароль"
            type="password"
            {...register("password")}
          />
          <FieldError />
        </div>
        <Button label={"Войти"} styles="items-center flex justify-center" />
      </form>
    </div>
  );
}
