"use client";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";

export function InputCalendar({ placeholder, value, onChange }) {
  const [isOpen, setOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks

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
      <div
        onClick={() => setOpen(true)}
        className="bg-[#333333] h-[52px] w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium cursor-pointer"
      >
        {placeholder}
      </div>
      {isOpen && (
        <Calendar
          onChange={(e) => {
            onChange(e);
            setOpen(false);
          }}
          value={value}
          locale="Ru-ru"
          className={`bg-lightGrey text-base font-semibold leading-5 rounded-2xl absolute top-0 z-10 p-6 w-full`}
        />
      )}
    </div>
  );
}
