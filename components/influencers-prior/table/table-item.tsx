import { Checkbox } from "../../checkbox/checkbox";

export const TableItem = ({
    number,
    item,
    el,
    index,
    checked,
    setChecked,
}: {
    number?: boolean;
    item: any;
    el: any;
    index: number;
    checked: null | string;
    setChecked: any;
}) => {
    if (item.boolean) {
        return el[item.key] ? "Hет" : "Да";
    }

    if (item.key === "id") {
        return number ? (
            index + 1
        ) : (
            <Checkbox
                checked={el.id === checked}
                onChange={() => {
                    setChecked(el.id);
                }}
            />
        );
    }

    if (item.status) {
        if (el[item.key] === "active") {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#1BFF1B]"></div>
                    <span>Активный</span>
                </div>
            );
        }

        if (el[item.key] === "archive") {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-red"></div>
                    <span>В aрхивe</span>
                </div>
            );
        }

        if (el[item.key] === "not_active") {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#1BFF1B]"></div>
                    <span>Не активный</span>
                </div>
            );
        }
        if (el[item.key] === "report") {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#FF1B1B]"></div>
                    <span>Отчет</span>
                </div>
            );
        }
        if (el[item.key] === "pending_review") {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                    <span>В ожидании</span>
                </div>
            );
        }
    }

    return (
        <div
            className={`${item.rounded
                    ? "border rounded-[10px] w-fit px-3 py-[6px] text-[12px] leading-[12px]"
                    : ""
                }`}
        >
            {el[item.key] ?? "-"}
        </div>
    );
}; 