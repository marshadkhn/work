"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navLinkClasses = (path) =>
    `flex items-center px-4 py-2 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md hover:bg-gray-200 ${
      pathname === path ? "bg-gray-300" : ""
    }`;

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Freelancer CRM</h1>
      </div>
      <nav className="mt-2 px-2">
        <Link href="/" className={navLinkClasses("/")}>
          Dashboard
        </Link>
        <Link href="/clients" className={navLinkClasses("/clients")}>
          Clients
        </Link>
        <Link href="/projects" className={navLinkClasses("/projects")}>
          Projects
        </Link>
        {/* Add other links here */}
      </nav>
    </div>
  );
};

export default Sidebar;
