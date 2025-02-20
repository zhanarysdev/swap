"use client";
import Link from "next/link";
import { Checkbox } from "../checkbox/checkbox";
import { Icon } from "../icons";
import { Filters } from "./filters";

export function Table({
  data,
  labels,
  onDelete,
  control,
  onEdit,
  goTo,
  filters = true,
  number,
  sort,
}: {
  number?: boolean;
  data: Record<string, string | number | any>[];
  labels: {
    key: string;
    title: string;
    isObject?: boolean;
    timeStamp?: boolean;
    rounded?: boolean;
    link?: string;
    status?: boolean;
  }[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  goTo?: string;
  control?: {
    label: string;
    action: () => void;
  };
  filters?: boolean;
  sort?: string[];
}) {
  const renderContent = (item, el, index) => {
    if (item.link) {
      const link = el[item.key].split("@");
      return <Link href={`${item.link}${link[1]}`}>{el[item.key]}</Link>;
    }

    if (item.timeStamp) {
      return el[item.key].seconds;
    }

    if (item.isObject) {
      return el[item.key]?.name;
    }

    if (item.key === "id") {
      return number ? index + 1 : <Checkbox />;
    }
    if (item.status) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#1BFF1B]"></div>{" "}
          <span>{el[item.key]}</span>
        </div>
      );
    }

    return (
      <div
        className={`${
          item.rounded
            ? "border rounded-[10px] w-fit px-3 py-[6px] text-[12px] leading-[12px]"
            : ""
        }`}
      >
        {el[item.key]}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {filters && <Filters sort={sort} labels={labels} control={control} />}
      <table>
        <thead>
          <tr>
            {labels.map(({ title, key }) => (
              <th
                key={key}
                className="text-[#AAAAAA] first-of-type:w-[44px] first-of-type:h-[44px]  border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left"
              >
                {title === "ID" && number ? "№" : title}
              </th>
            ))}
            {(onDelete || onEdit || goTo) && (
              <th className="text-[#AAAAAA] border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length
            ? data.map((el, index) => (
                <tr key={el.id}>
                  {labels.map((item) => (
                    <td
                      key={item.key}
                      className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
                    >
                      {renderContent(item, el, index)}
                    </td>
                  ))}
                  {(onDelete || onEdit || goTo) && (
                    <td className="flex gap-4 text-left border-b border-lightGrey font-semibold text-base px-3 py-2 leading-5 h-[45.5px]">
                      {goTo && (
                        <Link href={`${goTo}/${el.id}`}>
                          <Icon name="GoTo" />
                        </Link>
                      )}
                      {onDelete && (
                        <Icon
                          name="Trash"
                          onClick={() => onDelete(String(el.id))}
                          className="cursor-pointer"
                        />
                      )}

                      {onEdit && (
                        <Icon
                          name="Edit"
                          onClick={() => onEdit(String(el.id))}
                          className="cursor-pointer"
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
