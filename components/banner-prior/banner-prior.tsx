import { useState } from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Sortable } from "./sortable";

export const BannerPrior = ({ register, errors, control, setValue }: { 
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);

  const handleCheckboxChange = (name: string) => {
    if (selectedCheckbox === name) {
      setSelectedCheckbox(null);
      setValue('priority', '');
    } else {
      setSelectedCheckbox(name);
      setValue('priority', name);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Sortable
        id="link"
        name="link"
        register={register}
        errors={errors}
        control={control}
        selectedCheckbox={selectedCheckbox}
        onCheckboxChange={handleCheckboxChange}
        setValue={setValue}
      />
      <Sortable
        id="advertisment"
        name="advertisment"
        register={register}
        errors={errors}
        control={control}
        selectedCheckbox={selectedCheckbox}
        onCheckboxChange={handleCheckboxChange}
        setValue={setValue}
      />
      <Sortable
        id="category"
        name="category"
        register={register}
        errors={errors}
        control={control}
        selectedCheckbox={selectedCheckbox}
        onCheckboxChange={handleCheckboxChange}
        setValue={setValue}
      />
    </div>
  );
};
