import { ComponentProps,  useState } from "react";
import { Button } from "../button/button";
import { Modal } from "../modal/modal";
import { createPortal } from "react-dom";
import { Table } from "./table/table";
import { TableContext } from "./table/table-provider";
import { default_context } from "../temp/table-provider";
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
  onChange?: ( value: string) => void;
};

export function InputBanner({ add, onChange, ...props }: InputButtonProps) {
  const [isOpen, setOpen] = useState(false);
  const { context, setContext } = useContext(TableContext);
  const [checked, setChecked] = useState<string | null>(null);



  const { data, isLoading } = useSWR(
    {
      url: `tasks?page=1`,
    },
    fetcher
  );
  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        labels: labels,
      }));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    }
  }, []);




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
            <TableContext.Provider value={{ context: context, setContext: setContext }}>
              <Table
                labels={labels}
                checked={checked}
                setChecked={setChecked}
                data={data.result.tasks.map((el) => ({
                  ...el,
                  budget: `${el.spent_budget} / ${el.total_budget}`,
                  deadline: `${new Date(el.start_date).toLocaleDateString()} - ${new Date(el.end_date).toLocaleDateString()}`,
                }))} />
            </TableContext.Provider>
            <div className="flex justify-center mt-4">
              <Button
                label="Сохранить"
                type="button"
                onClick={() => {
                  onChange?.(checked)
                  setOpen(false)
                }}
              />
            </div>
          </Modal>,
          document.getElementById("page-wrapper")
        )}
    </>
  );
}
