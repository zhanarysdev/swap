import { ComponentProps, useState } from "react";
import { Icon } from "../icons";

type InputFileType = Omit<ComponentProps<"input">, 'value' | 'onChange'> & {
  value?: File | null ;
  onChange: (file: File) => void;
  placeholder?: string;
};

export function InputFile({ value, onChange, placeholder }: InputFileType) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div
      className={`w-full cursor-pointer ${dragActive ? 'border-2 border-dashed border-blue-500' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="fileInput"
        multiple
        onChange={handleChange}
      />
      <label
        htmlFor="fileInput"
        className="bg-[#333333] gap-2 cursor-pointer flex items-center w-full placeholder:text-grey rounded-2xl py-[15px] px-[25px] text-base leading-5 font-medium"
      >
        {value ? (
          <div className="flex items-center gap-2 w-full">
            <Icon name="Image" />
            <span className="text-white truncate">{value instanceof File ? value.name : value}</span>
          </div>
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
