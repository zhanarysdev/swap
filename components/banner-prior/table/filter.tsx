import { useContext } from "react";
import { Icon } from "../icons";
import { TableContext } from "./table-provider";
import { FilterMenu } from "./filter-menu";

export function Filter({
  labels,
  close,
}: {
  close: () => void;
  labels: { key: string; title: string }[];
}) {
  const options = labels.filter(({ key }) => key !== "id");
  const {
    context: { data },
  } = useContext(TableContext);

  const getUniqueOptions = (key: string) => {
    const values = data
      .map((el) => {
        const value = el[key];
        if (Array.isArray(value)) {
          return value.map((item) => {
            if (item && typeof item === "object" && "name" in item) {
              return { label: item.name, value: item.id };
            }
            return { label: item, value: item };
          });
        }
        if (value && typeof value === "object" && "name" in value) {
          return { label: value.name, value: value.id };
        }
        return { label: value, value: value };
      })
      .filter(Boolean)
      .flat();

    const uniqueValues = new Set();
    return values.filter((value) => {
      const stringValue = JSON.stringify(value);
      const isDuplicate = uniqueValues.has(stringValue);
      uniqueValues.add(stringValue);
      return !isDuplicate;
    });
  };

  return (
    <div className="bg-[#383838] flex flex-col gap-8 absolute z-10 left-0 top-0 rounded-2xl p-6 w-[336px]">
      <div className="flex items-center justify-between">
        <div className="font-bold leading-5 text-base">Фильтрация</div>
        <Icon name="Close" onClick={close} className="cursor-pointer" />
      </div>
      <div className="flex flex-col gap-4">
        {options.map((el) => (
          <FilterMenu key={el.key} el={el} options={getUniqueOptions(el.key)} />
        ))}
      </div>
    </div>
  );
}
