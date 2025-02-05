import { ComponentProps } from "react";

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      className="bg-[#333333] w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
      {...props}
    />
  );
}
