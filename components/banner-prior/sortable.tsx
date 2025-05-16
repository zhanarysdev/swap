'use client'
import { useSortable } from "@dnd-kit/sortable";
import { Controller } from "react-hook-form";
import { FieldError } from "../input/field-error";
import { Input } from "../input/input";
import { Select } from "../select/select";
import { InputBanner } from "./input-button";
import { Checkbox } from "../checkbox/checkbox";
import { post } from "@/fetcher";
import useSWR from "swr";
import { useEffect, useState } from "react";

export const Sortable = ({ 
  id, 
  name, 
  register, 
  errors, 
  control,
  selectedCheckbox,
  onCheckboxChange,
  setValue
}: { 
  id: string | number;
  name: string;
  register: any;
  errors: any;
  control: any;
  selectedCheckbox: string | null;
  onCheckboxChange: (name: string) => void;
  setValue: any;
}) => {
  const [categories, setCategories] = useState<any[]>([]);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `selection/list`,
      data: { request: { search: "", sort_by: "", sort_dir: "" } },
    },
    post,
  );
  useEffect(() => {
    if (data?.result) {
      setCategories(data.result);
    }
  }, [data]);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-4">
      {name === "link" && (
        <div className="flex gap-2 items-center">
          <div className="w-[54px] h-[54px] rounded-2xl bg-lightGrey grow-0 shrink-0 items-center justify-center flex">
            <Checkbox 
              styles="!w-auto !pl-[17px] !mb-[17px]" 
              checked={selectedCheckbox === "link"}
              onChange={() => onCheckboxChange("link")}
            />
          </div>
          <div className="w-full">
            <Input placeholder="Ссылка внешняя" {...register(name)} />
            <FieldError error={errors.link?.message} />
          </div>
        </div>
      )}
      {name === "advertisment" && (
        <div className="flex gap-2 items-center">
          <div className="w-[54px] h-[54px] rounded-2xl bg-lightGrey grow-0 shrink-0 items-center justify-center flex">
            <Checkbox 
              styles="!w-auto !pl-[17px] !mb-[17px]" 
              checked={selectedCheckbox === "advertisment"}
              onChange={() => onCheckboxChange("advertisment")}
            />
          </div>
          <div className="w-full">
            <InputBanner 
              placeholder="Объявление" 
              {...register(name)} 
              onChange={(value) => {
                setValue('link', value);
              }}
            />
            <FieldError error={errors.advertisment?.message} />
          </div>
        </div>
      )}
      {name === "category" && (
        <div className="flex gap-2 items-center">
          <div className="w-[54px] h-[54px] rounded-2xl bg-lightGrey grow-0 shrink-0 items-center justify-center flex">
            <Checkbox 
              styles="!w-auto !pl-[17px] !mb-[17px]" 
              checked={selectedCheckbox === "category"}
              onChange={() => onCheckboxChange("category")}
            />
          </div>
          <div className="w-full">
            <Controller
              control={control}
              name={'link'}
              render={({ field: { value, onChange } }) => (
                <Select
                  data={value ? value : "Подборка категорий"}
                  onChange={onChange}
                  options={categories.map((el) => ({ value: el.id, label: el.title }))}
                />
              )}
            />
            <FieldError error={errors.category?.message} />
          </div>
        </div>
      )}
    </div>
  );
};
