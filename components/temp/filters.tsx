"use client";
import { useContext, useState } from "react";
import { Button, ButtonBG } from "../button/button";
import { Icon } from "../icons";
import { Search } from "../input/search";
import { Sort } from "./sort";
import { Filter } from "./filter";
import { TableContext } from "./table-provider";

export function Filters() {
  const [isSort, setSort] = useState(false);
  const [isFilter, setFilter] = useState(false);
  const {
    context: { filters, control, sort, labels },
    setContext,
  } = useContext(TableContext);
  return (
    <div className="justify-between flex items-center bg-[#383838] py-2 px-4 rounded-2xl relative">
      <div className="flex gap-4 items-center">
        <Icon
          name="Sorting"
          className="cursor-pointer"
          onClick={() => setSort(true)}
        />
        {filters && (
          <Icon
            name="Filter"
            className="cursor-pointer"
            onClick={() => setFilter(true)}
          />
        )}
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
      {isSort && (
        <Sort
          close={() => setSort(false)}
          labels={sort ? labels.filter((el) => sort.includes(el.key)) : labels}
        />
      )}
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
