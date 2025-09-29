"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Briefcase, LogOut, Wallet } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navLinkClasses = (path) =>
    `flex items-center px-3 py-2 text-zinc-400 transition-colors duration-200 transform rounded-lg hover:bg-zinc-700 hover:text-zinc-100 ${
      pathname === path ? "bg-zinc-700 text-white" : ""
    }`;

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-4 flex items-center justify-center border-b border-zinc-800 h-16">
          <h1 className="text-xl font-bold text-zinc-100 ml-2">
            My Management
          </h1>
        </div>
        <nav className="mt-4 px-3">
          <Link href="/" className={navLinkClasses("/")}>
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/workspaces" className={navLinkClasses("/workspaces")}>
            <Briefcase className="h-5 w-5 mr-3" />
            Workspaces
          </Link>
          <Link href="/expenses" className={navLinkClasses("/expenses")}>
            <Wallet className="h-5 w-5 mr-3" />
            Expenses
          </Link>
        </nav>
      </div>
      <div className="px-3 py-4 border-t border-zinc-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center bg-zinc-700/50 text-red-400 font-semibold px-4 py-2 rounded-lg hover:bg-zinc-700 hover:text-red-300 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
