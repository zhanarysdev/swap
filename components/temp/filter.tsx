import { useContext } from "react";
import { Icon } from "../icons";
import Radio from "../radio/radio";
import { TableContext } from "./table-provider";
import { Checkbox } from "../checkbox/checkbox";
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
    setContext,
    context: { filterValue, data },
  } = useContext(TableContext);
  console.log(data.filter((el) => el[options[1].key]));
  return (
    <div className="bg-[#383838] flex flex-col gap-8 absolute z-10 left-0 top-0 rounded-2xl p-6 w-[336px]">
      <div className="flex items-center justify-between">
        <div className="font-bold leading-5 text-base">Фильтрация</div>
        <Icon name="Close" onClick={close} className="cursor-pointer" />
      </div>
      <div className="flex flex-col gap-4">
        {options.map((el) => (
          <FilterMenu key={el.key} el={el} data={data} />
        ))}
      </div>
      {/* <Radio
        options={options}
        value={filterValue}
        onChange={(e) => {
          setContext((prev) => ({ ...prev, filterValue: e }));
          close();
        }}
      /> */}
    </div>
  );
}
