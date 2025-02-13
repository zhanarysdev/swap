"use client";
import { useState } from "react";
import Calendar from "react-calendar";

export function InputCalendar({ placeholder }: { placeholder: string }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="relative">
      <div
        onClick={() => setOpen(true)}
        className="bg-[#333333] h-[52px] w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
      >
        {placeholder}
      </div>
      {isOpen && (
        <Calendar
          locale="Ru-ru"
          className={`bg-lightGrey text-base font-semibold leading-5 rounded-2xl absolute top-0 z-10 p-6`}
        />
      )}
    </div>
  );
}
