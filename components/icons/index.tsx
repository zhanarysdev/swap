"use client";
import { CSSProperties } from "react";
import { Ads } from "./ads";
import { Arrow } from "./arrow";
import { Bag } from "./bag";
import { Bell } from "./Bell";
import { Category } from "./category";
import { Charts } from "./charts";
import { Close } from "./close";
import { Directories } from "./directories";
import { DropArrow } from "./drop-arrow";
import { Edit } from "./edit";
import { Filter } from "./filter";
import { Image } from "./image";
import { Info } from "./info";
import { Logo } from "./logo";
import { Search } from "./search";
import { Sorting } from "./sorting";
import { Trash } from "./trash";
import { Users } from "./users";

const icons = {
  Ads,
  Arrow,
  Bag,
  Bell,
  Category,
  Close,
  Charts,
  DropArrow,
  Directories,
  Edit,
  Filter,
  Users,
  Logo,
  Image,
  Info,
  Sorting,
  Search,
  Trash,
};
export function Icon({
  className,
  name,
  onClick,
  style,
}: {
  className?: string;
  name: keyof typeof icons;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const Component = icons[name];
  return (
    <div style={style} className={className} onClick={onClick}>
      <Component />
    </div>
  );
}
