import { SideBar } from "@/components/sidebar/sidebar";
import TableProvider from "@/components/temp/table-provider";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <TableProvider>
      <div className="flex h-full">
        <SideBar />
        <div
          id="page-wrapper"
          className="bg-black flex-1 p-6 min-h-full h-fit relative"
        >
          {children}
        </div>
      </div>
    </TableProvider>
  );
}
