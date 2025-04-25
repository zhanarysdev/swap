"use client";
import { useSortable } from "@dnd-kit/sortable";
import Link from "next/link";
import { Checkbox } from "../checkbox/checkbox";
import { Icon } from "../icons";
import { CSS } from "@dnd-kit/utilities";

const renderContent = (item, el, index, number) => {
  if (item.link) {
    const link = el[item.key].split("@");
    return <Link href={`${item.link}${link[1]}`}>{el[item.key]}</Link>;
  }

  if (item.timeStamp) {
    return el[item.key].seconds;
  }

  if (item.isObject) {
    return el[item.key]?.name;
  }

  if (item.key === "id") {
    return <Icon name="Drag" />;
  }

  return (
    <div
      className={`${
        item.rounded
          ? "border rounded-[10px] w-fit px-3 py-[6px] text-[12px] leading-[12px]"
          : ""
      }`}
    >
      {el[item.key]}
    </div>
  );
};

export const SortableRow = ({
  index,
  el,
  labels,
  number,
  onEdit,
  onDelete,
  goTo,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: el.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    backgroundColor: isDragging ? "#383838" : "",
  };

  return (
    <tr
      key={el.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {labels.map((item) => (
        <td
          key={item.key}
          className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
        >
          {renderContent(item, el, index, number)}
        </td>
      ))}
      {(onDelete || onEdit || goTo) && (
        <td className="flex gap-4 text-left border-b border-lightGrey font-semibold text-base px-3 py-2 leading-5">
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
        </td>
      )}
    </tr>
  );
};
