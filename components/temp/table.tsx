"use client";
import Link from "next/link";
import { useContext } from "react";
import { Icon } from "../icons";
import { Spinner } from "../spinner/spinner";
import { Filters } from "./filters";
import { TableContext } from "./table-provider";
import { TableItem } from "./table-item";

export default function Table() {
  const {
    context: { data, number, pure, labels, isLoading, onDelete, onEdit, goTo, checked },
    setContext
  } = useContext(TableContext);


  return (
    <div className="flex flex-col gap-4">
      {!pure && <Filters />}

      {isLoading ? (
        <Spinner />
      ) : (
        <table>
          <thead>
            <tr>
              {labels.map(({ title, key }, index) => (
                <th
                  key={`${key} - ${index}`}
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
                <tr key={`${el.id} - ${index}`}>
                  {labels.map((item) => (
                    <td
                      key={item.key}
                      className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
                    >
                      <TableItem number={number} item={item} el={el} index={index} checked={checked} setChecked={setContext} />
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
      )}
    </div>
  );
}
