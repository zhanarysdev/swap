import { useState } from "react";

export default function Radio({ options, onChange, value }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option.title}
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onChange(option.key)}
        >
          <span className="text-base leading-5 font-semibold">
            {option.title}
          </span>
          <input
            type="radio"
            name="customRadio"
            value={option.key}
            checked={option.key === value}
            onChange={(e) => onChange(e.target.value)}
            className="hidden peer"
          />
          <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-400 flex items-center justify-center transition-all">
            {option.key === value && (
              <div className="w-2.5 h-2.5 bg-white rounded-full transition-opacity"></div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
