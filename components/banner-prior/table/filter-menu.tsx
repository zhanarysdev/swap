import { useState, useContext, useCallback, useEffect } from "react";
import { Icon } from "../icons";
import { TableContext } from "./table-provider";
import { useDebounce } from "@/components/debuncer";
import Radio from "../radio/radio";
import { Input } from "../input/input";

export const FilterMenu = ({
  el,
  options,
}: {
  el: { key: string; title: string };
  options: { label: string; value: string }[];
}) => {
  const [isOpen, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const {
    context: { filterValue },
    setContext,
  } = useContext(TableContext);

  const debouncedValue = useDebounce(pendingValue, 500);

  useEffect(() => {
    if (debouncedValue !== null) {
      setContext((prev) => ({
        ...prev,
        filterValue: {
          ...prev.filterValue,
          [el.key]: debouncedValue,
        },
      }));
    }
  }, [debouncedValue, el.key, setContext]);

  const handleClick = useCallback(
    (value: string) => {
      const currentValue = filterValue?.[el.key];
      // If clicking the same value, clear the selection
      if (currentValue === value) {
        setPendingValue(undefined);
      } else {
        setPendingValue(value);
      }
    },
    [el.key, filterValue],
  );

  const selectedValue = filterValue?.[el.key];

  const getTitle = (title: string, label: string) => {
    if (title === "gender") {
      if (label === "male") {
        return "Мужской";
      } else {
        return "Женский";
      }
    }
    if (title === "rank") {
      if (label === "gold") {
        return "Золото";
      }
      if (label === "silver") {
        return "Серебро";
      }
      if (label === "bronze") {
        return "Бронза";
      } else {
        return "Платина";
      }
    }
    if (title === "status") {
      if (label === "pending_review") {
        return "В ожидании";
      }
    }
    return label;
  };

  return (
    <div key={el.key} className="flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((old) => !old)}
      >
        <span className={selectedValue ? "text-white" : ""}>{el.title}</span>
        <Icon name="DropArrow" className={isOpen ? "rotate-180" : ""} />
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          <Radio
            options={options.map((opt) => ({
              key: opt.value,
              title: getTitle(el.key, opt.label),
            }))}
            value={selectedValue || ""}
            onChange={handleClick}
            styles={undefined}
          />
        </div>
      )}
    </div>
  );
};
