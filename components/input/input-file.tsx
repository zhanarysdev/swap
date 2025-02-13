import { ComponentProps, useState } from "react";
import { Icon } from "../icons";

type InputFileType = ComponentProps<"input"> & {
  value: string;
  onChange: (e: string) => void;
};

export function InputFile({ value, onChange, placeholder }: InputFileType) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div
      className="w-full cursor-pointer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="fileInput"
        onChange={handleChange}
      />
      <label
        htmlFor="fileInput"
        className="bg-[#333333] gap-2 cursor-pointer flex w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
      >
        {value ? (
          value
        ) : (
          <>
            <Icon name="Upload" />
            <span className="text-[#AAAAAA]">{placeholder}</span>
          </>
        )}
      </label>
    </div>
  );
}
