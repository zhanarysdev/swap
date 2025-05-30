import { Icon } from "@/components/icons";
import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="relative flex-1">
        <Image fill sizes="100% 100%" src={"/login.png"} alt={"login"} />
      </div>
      <div className="flex-1 flex flex-col justify-between py-10 px-[60px]">
        <div className="flex justify-between items-center">
          <div>
            <Icon name="Logo" />
          </div>
        </div>
        <div className="flex justify-center">{children}</div>
        <div className="flex flex-col gap-2">
          <p className="prose-sm text-grey">© 2025 Swapp</p>
          <a href="#" className="prose-sm text-white">
            Политика конфиденциальности{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
