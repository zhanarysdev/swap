import { ComponentProps } from "react";
import { Icon } from "../icons";
import { Button } from "../button/button";

type InputButtonProps = ComponentProps<"input"> & {
  add: () => void;
};

export function InputBanner({ add, ...props }: InputButtonProps) {
  return (
    <div className="bg-[#333333] w-full rounded-2xl flex items-center">
      <input
        className="bg-transparent placeholder:text-grey  py-[15px] px-[25px] text-base leading-5 font-medium"
        {...props}
      />
      <Button
        label={"Выбрать"}
        type="button"
        styles="ml-auto !mr-2 !min-h-[38px] h-[38px]"
      />
    </div>
  );
}
