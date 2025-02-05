"use client";
import { Checkbox } from "../checkbox/checkbox";
import { Icon } from "../icons";
import { Filters } from "./filters";

export function Table({
  data,
  labels,
  onDelete,
  control,
  onEdit,
}: {
  data: Record<string, string | number>[];
  labels: { key: string; title: string }[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  control?: {
    label: string;
    action: () => void;
  };
}) {
  return (
    <div className="flex flex-col gap-4">
      <Filters labels={labels} control={control} />
      <table>
        <thead>
          <tr>
            {labels.map(({ title, key }) => (
              <th
                key={key}
                className="text-[#AAAAAA] first-of-type:w-[44px] first-of-type:h-[44px]  border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left"
              >
                {title}
              </th>
            ))}
            {(onDelete || onEdit) && (
              <th className="text-[#AAAAAA] border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((el) => (
            <tr key={el.id}>
              {labels.map((item) => (
                <td
                  key={item.key}
                  className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
                >
                  {item.key === "id" ? <Checkbox /> : el[item.key]}
                </td>
              ))}
              {(onDelete || onEdit) && (
                <td className="flex gap-4 text-left border-b border-lightGrey font-semibold text-base px-3 py-2 leading-5">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
