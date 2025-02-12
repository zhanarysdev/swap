import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Controller } from "react-hook-form";
import { FieldError } from "../input/field-error";
import { Input } from "../input/input";
import { Select } from "../select/select";
import { InputBanner } from "./input-button";
import { Checkbox } from "../checkbox/checkbox";

export const Sortable = ({ id, name, register, errors, control }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    cursor: "grab",
  };

  return (
    <div
      className="flex flex-col gap-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {name === "link" && (
        <div className="flex gap-2 items-center">
          <div className="w-[54px] h-[54px] rounded-2xl bg-lightGrey grow-0 shrink-0 items-center justify-center flex">
            <Checkbox styles="!w-auto !pl-[17px] !mb-[17px]" />
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
            <Checkbox styles="!w-auto !pl-[17px] !mb-[17px]" />
          </div>
          <div className="w-full">
            <InputBanner placeholder="Объявление" {...register(name)} />
            <FieldError error={errors.link?.message} />
          </div>
        </div>
      )}
      {name === "category" && (
        <div className="flex gap-2 items-center">
          <div className="w-[54px] h-[54px] rounded-2xl bg-lightGrey grow-0 shrink-0 items-center justify-center flex">
            <Checkbox styles="!w-auto !pl-[17px] !mb-[17px]" />
          </div>
          <div className="w-full">
            <Controller
              control={control}
              name={name}
              render={({ field: { value, onChange } }) => (
                <Select
                  data={value ? value : "Подборка категорий"}
                  onChange={onChange}
                  options={[{ value: "test", label: "test" }]}
                />
              )}
            />
            <FieldError error={errors.link?.message} />
          </div>
        </div>
      )}
    </div>
  );
};
