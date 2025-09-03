"use client";
import React from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <main>{children}</main>;
  }
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default Layout;
