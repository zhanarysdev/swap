import Link from "next/link";
import { Checkbox } from "../checkbox/checkbox";
import { format } from "date-fns";

export const TableItem = ({
  number,
  item,
  el,
  index,
  checked,
  setChecked,
}: {
  number?: boolean;
  item: any;
  el: any;
  index: number;
  checked: string[];
  setChecked: any;
}) => {
  if (item.boolean) {
    return el[item.key] ? "Hет" : "Да";
  }
  if (item.date && el[item.key]) {
    return format(new Date(el[item.key]), "dd.MM.yyyy");
  }
  if (item.link) {
    const link = el[item.key].split("@");
    return (
      <Link
        href={`${item.link === true ? "" : item.link}${link[1] ? `${link[1]}` : el[item.key]}`}
      >
        {el[item.key]}
      </Link>
    );
  }

  if (item.name) {
    return el[item.key]?.name;
  }

  if (item.key === "id") {
    return number ? (
      index + 1
    ) : (
      <Checkbox
        checked={checked.includes(el.id)}
        onChange={() => {
          setChecked((prev) => {
            if (checked.includes(el.id)) {
              return {
                ...prev,
                checked: checked.filter((old) => old !== el.id),
              };
            }
            return { ...prev, checked: [...prev.checked, el.id] };
          });
        }}
      />
    );
  }

  if (item.gender) {
    if (el[item.key] === "man" || el[item.key] === "male") {
      return "Мужчина";
    }
    if (el[item.key] === "female") {
      return "Женщина";
    }
  }

  if (item.rank) {
    if (el[item.key].name === "gold") {
      return "Золото";
    }
    if (el[item.key].name === "silver") {
      return "Серебро";
    }
    if (el[item.key].name === "bronze") {
      return "Бронза";
    }
    if (el[item.key].name === "platinum") {
      return "Платина";
    }
  }
  if (item.restriction) {
    if (el[item.key]) {
      return "Да";
    } else {
      return "Нет";
    }
  }
  if (item.image) {
    return <img className="h-[80px]" src={el[item.key]} />;
  }

  if (item.status) {
    if (el[item.key] === "active") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#1BFF1B]"></div>
          <span>Активный</span>
        </div>
      );
    }
    if (el[item.key] === "not_active") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#1BFF1B]"></div>
          <span>Не активный</span>
        </div>
      );
    }
    if (el[item.key] === "report") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#FF1B1B]"></div>
          <span>Отчет</span>
        </div>
      );
    }
    if (el[item.key] === "pending_review") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
          <span>В ожидании</span>
        </div>
      );
    }
  }

  if (item.category) {
    return (
      <div className="flex gap-2">
        {el[item.key].map((category) => {
          return (
            <div
              key={category.name}
              className={
                "border rounded-[10px] w-fit px-3 py-[6px] text-[12px] leading-[12px]"
              }
            >
              {category.name}
            </div>
          );
        })}
      </div>
    );
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
