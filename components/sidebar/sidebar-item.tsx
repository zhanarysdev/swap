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
        className={` px-3 hover:bg-[#383838] rounded-2xl cursor-pointer w-[269px] ${
          pathname === href ? "bg-[#383838]" : ""
        }`}
        style={href === "/directories" ? { marginTop: "24px" } : {}}
      >
        <Link
          href={submenu ? "" : href}
          onClick={() => {
            if (submenu) {
              setOpen((old) => !old);
            }
          }}
          className={`flex items-center gap-3 py-[14px] font-bold text-base leading-5`}
        >
          <Icon name={icon as any} />
          <span>{label}</span>
          {submenu && (
            <Icon
              name="DropArrow"
              className={`ml-auto mr-3 ${isOpen ? "rotate-180" : ""}`}
              onClick={() => setOpen((old) => !old)}
            />
          )}
        </Link>
      </li>

      {submenu &&
        isOpen &&
        submenu.map(({ label, href, sub_submenu }) => (
          <div key={label} className="flex flex-col gap-1">
            <li
              className={`hover:bg-[#383838] rounded-2xl ml-4 cursor-pointer w-[253px] ${
                href === pathname ? "bg-[#383838]" : ""
              }`}
              style={href === "/directories" ? { marginTop: "24px" } : {}}
            >
              <Link
                href={sub_submenu ? "" : href}
                onClick={() => {
                  setSub((old) => (sub_submenu ? !old : null));
                }}
                className="flex items-center hover:bg-[#383838] hover:rounded-2xl cursor-pointer w-[253px] px-3 py-[14px] font-bold text-base leading-5"
              >
                <span>{label}</span>
                {sub_submenu && (
                  <Icon
                    name="DropArrow"
                    className={`ml-auto mr-3 ${sub ? "rotate-180" : ""}`}
                    onClick={() => setSub((old) => !old)}
                  />
                )}
              </Link>
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
