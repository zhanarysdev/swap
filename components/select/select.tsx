import { useEffect, useState } from "react";
import { Icon } from "../icons";

export const Select = ({
  data,
  options,
  onChange,
}: {
  data: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState(() => data);
  useEffect(() => {
    setValue(data);
  }, [data]);
  return (
    <div className="relative">
      <div className="relative w-full">
        <div
          className={`styled-select bg-[#333333] w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium ${
            isOpen ? "rounded-bl-none rounded-br-none" : ""
          }`}
        >
          <option value={value}>{value}</option>
        </div>

        <Icon
          name="DropArrow"
          style={{ transform: "translate(0, -50%)" }}
          className={`z-0 cursor-pointer absolute right-3 top-[50%] text-dark-grey w-[20px] h-[20px]}`}
          onClick={() => setOpen((old) => !old)}
        />
      </div>

      {isOpen && (
        <div className="absolute flex flex-col gap-4 z-10 styled-select  bg-[#333333] w-full rounded-tl-none rounded-tr-none rounded-2xl px-[13px] pb-4">
          {options.map(({ value, label }) => (
            <option
              key={value}
              value={value}
              className="hover:bg-lightGrey cursor-pointer  placeholder:text-grey   rounded-2xl py-[15px] px-[12px] text-base leading-5 font-medium"
              onClick={() => {
                setValue(value);
                onChange(value);
                setOpen(false);
              }}
            >
              {label}
            </option>
          ))}
        </div>
      )}
    </div>
  );
};
