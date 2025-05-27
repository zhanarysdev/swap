"use client";
import { TableItem } from "./table-item";

export function Table({ data, labels, checked, setChecked }) {
    return (
        <div className="flex flex-col gap-4">
            <table>
                <thead>
                    <tr>
                        {labels.map(({ title, key }, index) => (
                            <th
                                key={`${key} - ${index}`}
                                className={`text-[#AAAAAA] first-of-type:w-[44px] first-of-type:h-[44px] border-b border-lightGrey font-semibold text-base leading-5 p-3 text-left`}
                            >
                                <div className="flex items-center ">
                                    <span className="mr-2">
                                        {title}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length
                        ? data.map((el, index) =>
                            <tr key={index}>
                                {labels.map((item) => (
                                    <td
                                        key={item.key}
                                        className="text-left border-b border-lightGrey font-semibold text-base leading-5 p-3 py-2"
                                    >
                                        <TableItem
                                            number={false}
                                            item={item}
                                            el={el}
                                            index={index}
                                            checked={checked}
                                            setChecked={setChecked}
                                        />
                                    </td>
                                ))}
                            </tr>
                        )
                        : null}
                </tbody>
            </table>
        </div>
    );
} 