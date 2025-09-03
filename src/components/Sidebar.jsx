"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  LogOut,
  UserCircle,
  Wallet,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinkClasses = (path) =>
    `flex items-center px-3 py-2 text-slate-300 transition-colors duration-200 transform rounded-lg hover:bg-slate-700 hover:text-slate-100 ${
      pathname === path ? "bg-slate-700 text-white" : ""
    }`;

  if (pathname === "/login") {
    return null;
  }

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-4 flex items-center justify-center border-b border-slate-700">
          <Briefcase className="h-8 w-8 text-blue-500" />
          <h1 className="text-xl font-bold text-slate-100 ml-2">
            Freelancer CRM
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
          {/* --- YEH NAYA LINK ADD KAREIN --- */}
          <Link href="/expenses" className={navLinkClasses("/expenses")}>
            <Wallet className="h-5 w-5 mr-3" />
            Expenses
          </Link>
        </nav>
      </div>
      <div className="px-3 py-4 border-t border-slate-700">
        <div className="flex items-center mb-4 p-2">
          <UserCircle className="h-8 w-8 text-slate-400" />
          <div className="ml-3">
            <p className="text-sm font-semibold text-slate-200">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
