import { useEffect, useRef, useState } from "react";
import { Icon } from "../icons";

export const MultiSelect = ({
  data,
  options,
  onChange,
  disabled,
}: {
  data: string[];
  options: { value: string; label: string }[];
  onChange: (v: string[]) => void;
  disabled: boolean;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [curValue, setValue] = useState(() => data);
  const selectRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks

  useEffect(() => {
    setValue(data);
  }, [data]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false); // Close dropdown if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <div className="relative w-full">
        <div
          onClick={() => setOpen((old) => !old)}
          className={`styled-select bg-[#333333] w-full rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium ${
            !disabled && isOpen ? "rounded-bl-none rounded-br-none" : ""
          }`}
        >
          <option
            value={curValue}
            className={`cursor-pointer py-[1px] text-base leading-5 font-medium ${disabled ? "text-[#aaa]" : ""}`}
          >
            {curValue
              .map((val) => options.find((el) => el.value === val)?.label)
              .filter(Boolean)
              .join(", ")}
          </option>
        </div>

        <Icon
          name="DropArrow"
          style={{ transform: "translate(0, -50%)" }}
          className={`z-0 cursor-pointer absolute right-3 top-[50%] text-dark-grey w-[20px] h-[20px]}`}
          onClick={() => setOpen((old) => !old)}
        />
      </div>

      {!disabled && isOpen && (
        <div className="absolute flex flex-col gap-4 z-10 styled-select bg-[#333333] w-full rounded-tl-none rounded-tr-none rounded-2xl px-[13px] pb-4">
          {options.map(({ value, label }) => (
            <div
              key={value}
              className="hover:bg-lightGrey cursor-pointer placeholder:text-grey rounded-2xl py-[15px] px-[12px] text-base leading-5 font-medium"
              onClick={() => {
                if (curValue.includes(value)) {
                  const updated = curValue.filter((v) => v !== value);
                  setValue(updated);
                  onChange(updated);
                } else {
                  setValue((old) => [...old, value]);
                  onChange([...curValue, value]);
                  setOpen(false);
                }
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
