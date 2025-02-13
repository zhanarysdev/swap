import { useState } from "react";

export default function Radio({ options }) {
  const [checked, setChecked] = useState<null | string>(null);
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option.title}
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setChecked(option.title)}
        >
          <span className="text-base leading-5 font-semibold">
            {option.title}
          </span>
          <input
            type="radio"
            name="customRadio"
            value={option.key}
            className="hidden peer"
          />
          <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-400 flex items-center justify-center transition-all">
            {checked === option.title && (
              <div className="w-2.5 h-2.5 bg-white rounded-full transition-opacity"></div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
