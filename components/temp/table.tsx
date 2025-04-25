"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { Icon } from "../icons";
import { Spinner } from "../spinner/spinner";
import { Filters } from "./filters";
import { TableContext } from "./table-provider";
import { TableItem } from "./table-item";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortValue = {
  key: string;
  direction: "asc" | "desc";
} | null;

const SortableRow = ({
  draggable,
  el,
  index,
  labels,
  number,
  onDelete,
  onEdit,
  goTo,
  checked,
  setChecked,
}: {
  draggable?: boolean;
  el: any;
  index: number;
  labels: any[];
  number?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  goTo?: string;
  checked?: any;
  setChecked?: (value: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: el.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    backgroundColor: isDragging ? "#383838" : "",
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(String(el.id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(String(el.id));
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {labels.map((item) => (
        <td
          key={item.key}
          className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
        >
          <TableItem
            draggable={draggable}
            number={number}
            item={item}
            el={el}
            index={index}
            checked={checked}
            setChecked={setChecked}
          />
        </td>
      ))}
      {(onDelete || onEdit || goTo) && (
        <td
          className="border-b border-lightGrey"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex gap-4 text-left  font-semibold text-base px-3 py-2 leading-5 ">
            {goTo && (
              <Link href={`${goTo}/${el.id}`}>
                <Icon name="GoTo" />
              </Link>
            )}
            {onDelete && (
              <button onClick={handleDelete} className="cursor-pointer">
                <Icon name="Trash" />
              </button>
            )}
            {onEdit && (
              <button onClick={handleEdit} className="cursor-pointer">
                <Icon name="Edit" />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

const RegularRow = ({
  el,
  index,
  labels,
  number,
  onDelete,
  onEdit,
  goTo,
  checked,
  setChecked,
}) => {
  return (
    <tr>
      {labels.map((item) => (
        <td
          key={item.key}
          className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
        >
          <TableItem
            number={number}
            item={item}
            el={el}
            index={index}
            checked={checked}
            setChecked={setChecked}
          />
        </td>
      ))}
      {(onDelete || onEdit || goTo) && (
        <td className="border-b border-lightGrey">
          <div className="flex gap-4 text-left  font-semibold text-base px-3 py-2 leading-5 ">
            {goTo && (
              <Link href={`${goTo}/${el.id}`}>
                <Icon name="GoTo" />
              </Link>
            )}
            {onDelete && (
              <Icon
                name="Trash"
                onClick={() => onDelete(String(el.id))}
                className="cursor-pointer"
              />
            )}
            {onEdit && (
              <Icon
                name="Edit"
                onClick={() => onEdit(String(el.id))}
                className="cursor-pointer"
              />
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default function Table({
  draggable = false,
  onDrag,
}: {
  draggable?: boolean;
  onDrag?: (newData: any) => void;
}) {
  const {
    context: {
      data,
      number,
      pure,
      labels,
      isLoading,
      onDelete,
      onEdit,
      goTo,
      checked,
      sortValue,
      sort,
      sortByTwoDirection,
    },
    setContext,
  } = useContext(TableContext);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSort = (key: string) => {
    if (!sort?.includes(key)) return;

    if (sortByTwoDirection) {
      const direction =
        sortValue?.key === key
          ? sortValue.direction === "asc"
            ? "desc"
            : "asc"
          : "asc";

      setContext((prev) => ({
        ...prev,
        sortValue: { key, direction },
      }));
    } else {
      setContext((prev) => ({
        ...prev,
        sortValue: key,
      }));
    }
  };

  const getSortIcon = (key: string) => {
    if (!sort?.includes(key)) return null;
    if (!sortValue || sortValue.key !== key) {
      return <ArrowDown className="w-4 h-4" />;
    }
    return sortValue.direction === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((item) => item.id === active.id);
    const newIndex = data.findIndex((item) => item.id === over.id);

    const newData = [...data];
    const [movedItem] = newData.splice(oldIndex, 1);
    newData.splice(newIndex, 0, movedItem);

    // Update order field for all items
    const updatedData = newData.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setContext((prev) => ({
      ...prev,
      data: updatedData,
    }));
    onDrag?.(updatedData);
  };

  const renderTable = () => (
    <table>
      <thead>
        <tr>
          {labels.map(({ title, key }, index) => (
            <th
              key={`${key} - ${index}`}
              className={`text-[#AAAAAA] first-of-type:w-[44px] first-of-type:h-[44px] border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left ${sort?.includes(key) ? "cursor-pointer" : ""}`}
              onClick={() => handleSort(key)}
            >
              <div className="flex items-center ">
                <span className="mr-2">
                  {title === "ID" && number ? "№" :title}
                </span>
                {getSortIcon(key)}
              </div>
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
        {data.length
          ? data.map((el, index) =>
              draggable ? (
                <SortableRow
                  draggable={draggable}
                  key={el.id}
                  el={el}
                  index={index}
                  labels={labels}
                  number={number}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  goTo={goTo}
                  checked={checked}
                  setChecked={setContext}
                />
              ) : (
                <RegularRow
                  key={el.id}
                  el={el}
                  index={index}
                  labels={labels}
                  number={number}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  goTo={goTo}
                  checked={checked}
                  setChecked={setContext}
                />
              ),
            )
          : null}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-4">
      {!pure && <Filters />}

      {isLoading ? (
        <Spinner />
      ) : draggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderTable()}
          </SortableContext>
        </DndContext>
      ) : (
        renderTable()
      )}
    </div>
  );
}
