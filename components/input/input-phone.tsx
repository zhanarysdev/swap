"use client";
import { useMask } from "@react-input/mask";
import mergeRefs from "merge-refs";
import { ComponentProps, forwardRef } from "react";

type InputProps = ComponentProps<"input"> & {};

export const InputPhone = forwardRef<HTMLInputElement & { defaultValue: string }>(
  (props: InputProps & { defaultValue: string }, ref) => {
    const telInputRef = useMask({
      mask: "+7 (___) ___-___-__",
      replacement: { _: /\d/ },
    });
    const refs = mergeRefs<HTMLInputElement>(telInputRef, ref);

    console.log(props,ref)

    return (
      <input
        className="bg-[#333333] w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
        {...props}
        ref={refs}
        defaultValue={props.defaultValue}
        placeholder={"+7 (777) 000-000-00"}
      />
    );
  }
);

InputPhone.displayName = "InputPhone";
