"use client";

import { createContext, useState } from "react";

type SortValue = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

type FilterValue = {
  [key: string]: string | undefined;
};

export const default_context = {
  search: "",
  data: [],
  labels: [],
  isLoading: false,
  filters: [],
  sort: [],
  sortValue: null as SortValue,
  sortByTwoDirection: false,
  pure: false,
  number: false,
  onDelete: null,
  onEdit: null,
  onSearch: null,
  goTo: null,
  control: null,
  filterValue: {} as FilterValue,
  checked: []
};

export const TableContext = createContext({
  context: {
    search: "",
    data: [],
    labels: [],
    isLoading: false,
    filters: [],
    sort: [],
    sortValue: null as SortValue,
    sortByTwoDirection: false,
    pure: false,
    number: false,
    onDelete: null,
    onEdit: null,
    onSearch: null,
    goTo: null,
    control: null,
    filterValue: {} as FilterValue,
    checked: []
  },
  setContext: (data) => data,
});

export default function TableProvider({ children }) {
  const [context, setContext] = useState({
    search: "",
    data: [],
    labels: [],
    isLoading: false,
    filters: [],
    sort: [],
    sortByTwoDirection: false,
    pure: false,
    number: false,
    onDelete: null,
    onEdit: null,
    goTo: null,
    sortValue: null as SortValue,
    onSearch: null,
    control: null,
    filterValue: {} as FilterValue,
    checked: []
  });
  return (
    <TableContext value={{ context, setContext }}>{children}</TableContext>
  );
}
