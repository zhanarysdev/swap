export enum ButtonBG {
  primary,
  orange,
  grey,
  red,
  white,
}
enum ButtonBGValues {
  primary = "#BEFF1B",
  orange = "#FFB71B",
  grey = "#383838",
  red = "#FF1B1F",
  white = "#FFFFFF",
}

export function Button({
  label,
  bg = ButtonBG.primary,
  onClick,
}: {
  label: string;
  bg?: ButtonBG;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        bg == ButtonBG.grey || bg == ButtonBG.red ? "text-white" : "text-black"
      } min-h-[44px] flex items-center justify-center w-full px-4 rounded-2xl`}
      style={{
        backgroundColor:
          ButtonBGValues[ButtonBG[bg] as keyof typeof ButtonBGValues],
      }}
    >
      {label}
    </button>
  );
}
