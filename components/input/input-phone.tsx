"use client";
import { useMask, format } from "@react-input/mask";
import mergeRefs from "merge-refs";
import { ComponentProps, forwardRef, useEffect, useState } from "react";

type InputProps = Omit<ComponentProps<"input">, 'defaultValue'> & {};

export const InputPhone = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [initialValue, setInitialValue] = useState<string>("");
    const telInputRef = useMask({
      mask: "+7 (___) ___-___-__",
      replacement: { _: /\d/ },
    });
    const refs = mergeRefs<HTMLInputElement>(telInputRef, ref);

    useEffect(() => {
      if (props.value) {
        const cleaned = String(props.value).replace(/\D/g, "");
        const formatted = format(cleaned, {
          mask: "+7 (___) ___-___-__",
          replacement: { _: /\d/ },
        });
        setInitialValue(formatted);
      }
    }, [props.value]);

    return (
      <input
        className="bg-[#333333] w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
        {...props}
        ref={refs}
        value={initialValue}
        placeholder={"+7 (777) 000-000-00"}
      />
    );
  }
);

InputPhone.displayName = "InputPhone";
