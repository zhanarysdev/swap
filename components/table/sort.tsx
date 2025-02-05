import { Icon } from "../icons";

export function Sort({
  labels,
  close,
}: {
  close: () => void;
  labels: { key: string; title: string }[];
}) {
  const data = labels.filter(({ key }) => key !== "id");
  return (
    <div className="bg-[#383838] flex flex-col gap-8 absolute left-0 top-0 rounded-2xl p-6 w-[336px]">
      <div className="flex items-center justify-between">
        <div className="font-bold leading-5 text-base">Сортировка</div>
        <Icon name="Close" onClick={close} className="cursor-pointer" />
      </div>
      <fieldset className="flex flex-col gap-4">
        {data.map(({ key, title }) => (
          <div
            className="font-semibold leading-5 text-base flex justify-between items-center"
            key={key}
          >
            <span>{title}</span>
            <input id={key} value={key} name="sort" type="radio" />
          </div>
        ))}
      </fieldset>
    </div>
  );
}
