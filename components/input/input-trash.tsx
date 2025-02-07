import { ComponentProps } from "react";
import { Icon } from "../icons";

type InputButtonProps = ComponentProps<"input"> & {
  remove: () => void;
};

export function InputTrash({ remove, ...props }: InputButtonProps) {
  return (
    <div className="bg-[#333333] w-full rounded-2xl flex items-center">
      <input
        className="bg-transparent placeholder:text-grey w-full py-[15px] px-[25px] text-base leading-5 font-medium"
        {...props}
      />
      <div
        className="flex justify-center items-center mr-[25px] cursor-pointer"
        onClick={remove}
      >
        <Icon name="Trash" className="text-black" />
      </div>
    </div>
  );
}
