"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderLink({
  children,
  href,
}: Readonly<{
  children: React.ReactNode;
  href: string;
}>) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-medium
        ${
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }
      `}
    >
      {children}
    </Link>
  );
}
