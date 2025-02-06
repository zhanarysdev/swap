"use client";
import Link from "next/link";
import { Icon } from "../icons";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function SideBarItem({
  label,
  href,
  icon,
  submenu,
}: {
  label: string;
  href: string;
  icon: string;
  submenu?: {
    label: string;
    href: string;
    sub_submenu?: {
      label: string;
      href: string;
    }[];
  }[];
}) {
  const [isOpen, setOpen] = useState(false);
  const [sub, setSub] = useState(false);
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-1">
      <li
        className={`flex items-center gap-3 px-3 hover:bg-[#383838] rounded-2xl cursor-pointer w-[269px] ${
          pathname === href ? "bg-[#383838]" : ""
        }`}
        style={href === "/directories" ? { marginTop: "24px" } : {}}
      >
        <Icon name={icon as any} />
        <Link href={href} className={`py-[14px] font-bold text-base leading-5`}>
          {label}
        </Link>
        {submenu && (
          <Icon
            name="DropArrow"
            className={`ml-auto mr-3 ${isOpen ? "rotate-180" : ""}`}
            onClick={() => setOpen((old) => !old)}
          />
        )}
      </li>

      {submenu &&
        isOpen &&
        submenu.map(({ label, href, sub_submenu }) => (
          <div key={label} className="flex flex-col gap-1">
            <li
              className={`flex items-center  hover:bg-[#383838] rounded-2xl ml-4 cursor-pointer w-[253px] ${
                href === pathname ? "bg-[#383838]" : ""
              }`}
              style={href === "/directories" ? { marginTop: "24px" } : {}}
            >
              <Link
                href={href}
                className="hover:bg-[#383838] hover:rounded-2xl cursor-pointer w-[253px] px-3 py-[14px] font-bold text-base leading-5"
              >
                {label}
              </Link>
              {sub_submenu && (
                <Icon
                  name="DropArrow"
                  className={`ml-auto mr-3 ${sub ? "rotate-180" : ""}`}
                  onClick={() => setSub((old) => !old)}
                />
              )}
            </li>

            {sub_submenu &&
              sub &&
              sub_submenu.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`hover:bg-[#383838] rounded-2xl cursor-pointer w-[237px] ml-[32px] px-3 py-[14px] font-bold text-base leading-5 ${
                    href === pathname ? "bg-[#383838]" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
          </div>
        ))}
    </div>
  );
}
