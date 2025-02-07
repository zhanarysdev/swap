import { ReactNode } from "react";
import { Icon } from "../icons";
import { Button, ButtonBG } from "../button/button";

export const ModalSave = ({
  children,
  label,
  close,
  onSave,
}: {
  children: ReactNode;
  label: string;
  close: () => void;
  onSave?: () => void;
}) => {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center backdrop-blur-sm bg-[rgba(0,0,0,0.2)]">
      <form
        onSubmit={onSave}
        className="bg-black p-6 rounded-[32px] z-10 min-w-[656px] flex flex-col gap-8"
      >
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold leading-7">{label}</div>
          <Icon name="Close" onClick={close} className="cursor-pointer" />
        </div>
        <div>{children}</div>
        <Button
          type="submit"
          styles="w-full justify-center"
          label={"Сохранить"}
          bg={ButtonBG.primary}
        />
      </form>
    </div>
  );
};
