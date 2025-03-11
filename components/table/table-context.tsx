"use client";
import { createContext, useState } from "react";

export const TableContext = createContext({
  tableData: { isLoading: false, searchData: "" },
  setTableData: (data) => data,
});

export const TableProvider = ({ children }) => {
  const [tableData, setTableData] = useState({
    isLoading: false,
    searchData: "",
  });
  return (
    <TableContext value={{ tableData, setTableData }}>{children}</TableContext>
  );
};
