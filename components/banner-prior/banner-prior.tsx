import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Input } from "../input/input";
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { FieldError } from "../input/field-error";
import { Sortable } from "./sortable";
import { useState } from "react";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function BannerPrior({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
}) {
  const [data, setData] = useState([
    { id: 0, name: "link" },
    { id: 1, name: "advertisment" },
    { id: 2, name: "category" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);
      setData(arrayMove(data, oldIndex, newIndex));
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={data as any}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {data.map((el) => (
            <Sortable
              register={register}
              control={control}
              errors={errors}
              name={el.name}
              key={el.id}
              id={el.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
