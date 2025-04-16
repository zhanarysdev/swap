"use client";
import { useContext, useState } from "react";
import { Button, ButtonBG } from "../button/button";
import { Icon } from "../icons";
import { Search } from "../input/search";
import { Filter } from "./filter";
import { TableContext } from "./table-provider";

export function Filters() {
  const [isFilter, setFilter] = useState(false);
  const {
    context: { filters, control,  labels },
    setContext,
  } = useContext(TableContext);
  return (
    <div className="justify-between flex items-center bg-[#383838] py-2 px-4 rounded-2xl relative">
      <div className="flex gap-4 items-center">
        {filters.length ? (
          <Icon
            name="Filter"
            className="cursor-pointer"
            onClick={() => setFilter(true)}
          />
        ) : null}
        <Search
          placeholder="Поиск"
          type="search"
          onChange={(e) =>
            setContext((prev) => ({ ...prev, search: e.target.value }))
          }
        />
      </div>
      <div>
        {control && (
          <Button
            styles="font-bold"
            bg={ButtonBG.primary}
            label={control.label}
            onClick={control.action}
          />
        )}
      </div>
      {isFilter && (
        <Filter
          close={() => setFilter(false)}
          labels={
            filters ? labels.filter((el) => filters.includes(el.key)) : labels
          }
        />
      )}
    </div>
  );
}
