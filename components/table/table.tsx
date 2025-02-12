"use client";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortableRow } from "./dragable";
import { Filters } from "./filters";

export function Table({
  data,
  labels,
  onDelete,
  control,
  onEdit,
  goTo,
  filters = true,
  number,
}: {
  number?: boolean;
  data: Record<string, string | number | any>[];
  labels: {
    key: string;
    title: string;
    isObject?: boolean;
    timeStamp?: boolean;
    rounded?: boolean;
    link?: string;
  }[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  goTo?: string;
  control?: {
    label: string;
    action: () => void;
  };
  filters?: boolean;
}) {
  const [dnddata, setData] = useState(data);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = dnddata.findIndex((item) => item.id === active.id);
      const newIndex = dnddata.findIndex((item) => item.id === over.id);
      setData(arrayMove(dnddata, oldIndex, newIndex));
    }
  };
  return (
    <div className="flex flex-col gap-4">
      {filters && <Filters labels={labels} control={control} />}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dnddata as any}
          strategy={verticalListSortingStrategy}
        >
          <table>
            <thead>
              <tr>
                {labels.map(({ title, key }) => (
                  <th
                    key={key}
                    className="text-[#AAAAAA] first-of-type:w-[44px] first-of-type:h-[44px]  border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left"
                  >
                    {title === "ID" && number ? "№" : title}
                  </th>
                ))}
                {(onDelete || onEdit || goTo) && (
                  <th className="text-[#AAAAAA] border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {dnddata.length
                ? dnddata.map((el, index) => (
                    <SortableRow
                      key={el.id}
                      index={index}
                      labels={labels}
                      el={el}
                      goTo={goTo}
                      onEdit={onEdit}
                      number={number}
                      onDelete={onDelete}
                    />
                  ))
                : null}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
