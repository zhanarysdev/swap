"use client";

import { createContext, useState } from "react";

export const TableContext = createContext({
  context: {
    search: "",
    data: [],
    labels: [],
    isLoading: false,
    filters: [],
    sort: [],
    sortValue: "",
    pure: false,
    number: false,
    onDelete: null,
    onEdit: null,
    onSearch: null,
    goTo: null,
    control: null,
    filterValue: "",
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
    pure: false,
    number: false,
    onDelete: null,
    onEdit: null,
    goTo: null,
    sortValue: "",
    onSearch: null,
    control: null,
    filterValue: "",
  });
  return (
    <TableContext value={{ context, setContext }}>{children}</TableContext>
  );
}
