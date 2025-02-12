import { ComponentProps } from "react";

type TText = ComponentProps<"textarea"> & {
  count: number;
  maxCount: number;
};

export function Text({ count, maxCount, ...props }: TText) {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        className="bg-[#333333] w-full min-h-[108px] placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
        {...props}
      />
      <div className="flex justify-end leading-[19.5px] text-base font-semibold">
        {count}/{maxCount}
      </div>
    </div>
  );
}
