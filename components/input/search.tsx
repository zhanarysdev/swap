import { ComponentProps } from "react";
import { Icon } from "../icons";

export function Search(props: ComponentProps<"input">) {
  return (
    <div className="relative bg-[#333333] placeholder:text-grey rounded-2xl py-2 px-3 text-sm leading-[18px] font-medium">
      <Icon name="Search" className="absolute left-3" />
      <input {...props} className="bg-transparent ml-6 focus:outline-none" />
    </div>
  );
}
