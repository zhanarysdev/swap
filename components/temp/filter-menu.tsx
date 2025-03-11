import { useState } from "react";
import { Checkbox } from "../checkbox/checkbox";
import { Icon } from "../icons";

export const FilterMenu = ({ el, data }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div key={el.key} className="flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((old) => !old)}
      >
        <span>{el.title}</span>
        <Icon name="DropArrow" className={isOpen ? "rotate-180" : ""} />
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          {data.map((item, index) =>
            item[el.key] ? (
              <div key={index} className="flex items-center justify-between">
                <span>{item[el.key]}</span>
                <Checkbox styles="w-auto pl-[21px] mb-0" />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
