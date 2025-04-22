import { ComponentProps } from "react";
import { Icon } from "../icons";

type InputButtonProps = ComponentProps<"input"> & {
  add: () => void;
};

export function InputButton({ add, ...props }: InputButtonProps) {
  return (
    <div className="bg-[#333333] w-full rounded-2xl flex items-center">
      <input
        className="w-full bg-transparent placeholder:text-grey  py-[15px] px-[25px] text-base leading-5 font-medium"
        {...props}
      />
      <div
        className="rounded-[15px] w-[50px] h-[50px] bg-primary flex justify-center items-center ml-auto mr-[2px] cursor-pointer"
        onClick={props.disabled ? null : add}
      >
        <Icon name="Plus" className="text-black" />
      </div>
    </div>
  );
}
