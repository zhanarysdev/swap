import { Button, ButtonBG } from "../button/button";
import { Icon } from "../icons";

export const ModalDelete = ({
  label,
  close,
  onDelete,
}: {
  label: string;
  close: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center backdrop-blur-sm bg-[rgba(0,0,0,0.2)]">
      <div className="bg-black p-6 rounded-[32px] z-10 min-w-[656px] flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold leading-7">{label}</div>
          <Icon name="Close" onClick={close} className="cursor-pointer" />
        </div>
        <div className="flex items-center gap-4">
          <Button
            styles="w-full justify-center"
            label="Отменить"
            onClick={close}
            bg={ButtonBG.grey}
          />
          <Button
            styles="w-full justify-center"
            label={"Удалить"}
            onClick={onDelete}
            bg={ButtonBG.red}
          />
        </div>
      </div>
    </div>
  );
};
