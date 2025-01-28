export enum EColors {
  primary,
  grey,
  red,
  white,
  black,
  darkBlack,
  lightGrey,
}
enum EColorsValues {
  primary = "#BEFF1B",
  grey = "#C8C8C8",
  red = "#D93438",
  white = "#FFFFFF",
  lightGrey = "#383838",
  darkBlack = "#171717",
  black = "#212121",
}
export function Colors({ color }: { color: EColors }) {
  return (
    <div
      className="w-[200px] h-[20px] rounded"
      style={{
        backgroundColor:
          EColorsValues[EColors[color] as keyof typeof EColorsValues],
      }}
    />
  );
}
