import { ComponentProps, use, useState } from "react";
import { Icon } from "../icons";
import { Button } from "../button/button";
import { Modal } from "../modal/modal";
import { createPortal } from "react-dom";
import Table from "../temp/table";
import { default_context, TableContext } from "../temp/table-provider";
import { useContext, useEffect } from "react";
import { fetcher } from "@/fetcher";
import useSWR from "swr";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "business_name",
    title: "Компания",
  },
  {
    key: "status",
    title: "Статус",
    status: true,
  },
];

type InputButtonProps = ComponentProps<"input"> & {
  add: () => void;
  onChange?: (value: string) => void;
};

export function InputBanner({ add, onChange, ...props }: InputButtonProps) {
  const [isOpen, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tableContext, setTableContext] = useState({
    ...default_context,
    data: [],
    labels: labels,
    onRowClick: (id: string) => {
      setSelectedId(prev => prev === id ? null : id);
    },
    control: undefined,
    onDelete: undefined,
    onEdit: undefined,
    search: "",
    sortValue: { key: "", direction: "asc" as const },
    filterValue: {},
    filters: [],
    sort: [],
    showSearch: false,
    showFilters: false,
    showSort: false,
    selectedCheckbox: selectedId,
    onCheckboxChange: (id: string) => {
      setSelectedId(prev => prev === id ? null : id);
    }
  });

  const { data, isLoading } = useSWR(
    {
      url: `tasks?page=1&search=${tableContext.search}&sortBy=${tableContext.sortValue.key}`,
    },
    fetcher
  );

  useEffect(() => {
    if (data?.result) {
      setTableContext((prev) => ({
        ...prev,
        data: data.result.tasks.map((el) => ({
          ...el,
          budget: `${el.spent_budget} / ${el.total_budget}`,
          deadline: `${new Date(el.start_date).toLocaleDateString()} - ${new Date(el.end_date).toLocaleDateString()}`,
        }))
      }));
    }
  }, [data]);

  useEffect(() => {
    setTableContext(prev => ({
      ...prev,
      selectedCheckbox: selectedId
    }));
  }, [selectedId]);

  const handleSave = () => {
    if (selectedId) {
      onChange?.(selectedId);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="bg-[#333333] w-full rounded-2xl flex items-center">
        <input
          className="bg-transparent placeholder:text-grey py-[15px] px-[25px] text-base leading-5 font-medium"
          {...props}
        />
        <Button
          label={"Выбрать"}
          type="button"
          styles="ml-auto !mr-2 !min-h-[38px] h-[38px]"
          onClick={() => setOpen(true)}
        />
      </div>
      {isOpen &&
        createPortal(
          <Modal label="Выберите объявление" close={() => setOpen(false)}>
            <TableContext.Provider value={{ context: tableContext, setContext: setTableContext }}>
              <Table />
            </TableContext.Provider>
            <div className="flex justify-end mt-4">
              <Button
                label="Сохранить"
                type="button"
                styles={`w-full !min-h-[38px] h-[38px] ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSave}
              />
            </div>
          </Modal>,
          document.getElementById("page-wrapper")
        )}
    </>
  );
}
