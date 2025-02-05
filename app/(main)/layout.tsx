import { SideBar } from "@/components/sidebar/sidebar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <SideBar />
      <div id="page-wrapper" className="bg-black flex-1 p-6 h-full relative">
        {children}
      </div>
    </div>
  );
}
