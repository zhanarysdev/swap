import Link from "next/link";
import { Checkbox } from "../checkbox/checkbox";

export const TableItem = ({number, item, el, index, checked, setChecked}: {
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
  if (item.link) {
    const link = el[item.key].split("@");
    return <Link href={`${item.link}${link[1]}`}>{el[item.key]}</Link>;
  }

  if (item.name) {
    return el[item.key]?.name;
  }

  if (item.key === "id") {
    return number ? index + 1 : <Checkbox checked={checked.includes(el.id)} onChange={() => setChecked(prev => ({...prev, checked: [...prev.checked, el.id]}))} />;
  }

  if(item.gender) {
    if(el[item.key] === "man") {
      return "Мужской"
    }
    if(el[item.key] === "female") {
      return "Женский"
    }
  }

  if (item.rank) {
    if (el[item.key] === "gold") {
      return "Золото"
    }
    if (el[item.key] === "silver") {
      return "Серебро"
    }
    if (el[item.key] === "bronze") {
      return "Бронза"
    }
  }
  if (item.restriction) {
    if (el[item.key]) {
      return "Да"
    } else {
      return "Нет"
    }

  }

  if (item.status) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-[8px] h-[8px] rounded-full bg-[#1BFF1B]"></div>
        <span>{el[item.key]}</span>
      </div>
    );
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
      className={`${item.rounded
          ? "border rounded-[10px] w-fit px-3 py-[6px] text-[12px] leading-[12px]"
          : ""
        }`}
    >
      {el[item.key]}
    </div>
  );
};