"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

//interface RoleCardProps {
//title: string;
//description: string;
//icon: ReactNode;
//href: string;
//active?: boolean;
//}

export default function RoleCard({
  title,
  description,
  icon,
  href,
  active = false,
}: any) {
  return (
    <Link href={href} className="block group">
      <div
        className={`
          flex items-center  p-9 rounded-xl   border ${
            active
              ? "border-blue-600 bg-blue-50/50"
              : "border-transparent bg-white shadow-[0px_8px_24px_rgba(149,157,165,0.1)] hover:border-blue-200"
          }
        `}
      >
        <div className="flex items-center gap-5">
          <div
            className={`
              h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full transition-colors duration-300
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-600 text-blue-600"
              }
            `}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1E2B3A]">{title}</h3>
            <p className="text-sm text-gray-500  mt-3">{description}</p>
          </div>
        </div>

        <div
          className={`
            
            ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          <ArrowRight size={20} className="text-blue-600" />
        </div>
      </div>
    </Link>
  );
}
