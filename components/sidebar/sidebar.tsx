import Link from "next/link";
import { Icon } from "../icons";
import { sideBarMenu } from "@/data";
import { SideBarItem } from "./sidebar-item";

export function SideBar() {
  return (
    <div className="p-6">
      <Link href="/" className="pl-3 mb-[64px] flex">
        <Icon name="Logo" className="[&>svg]:w-[155px] [&>svg]:h-[35px]" />
      </Link>
      <ul className="flex flex-col gap-1">
        {sideBarMenu.map(({ label, href, icon, submenu }) => (
          <SideBarItem
            key={label}
            label={label}
            href={href}
            icon={icon}
            submenu={submenu}
          />
        ))}
      </ul>
    </div>
  );
}
