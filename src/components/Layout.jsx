"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react"; // Hamburger icon ke liye

const Layout = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === "/login") {
    return <main>{children}</main>;
  }

  return (
    <div className="flex bg-zinc-950 min-h-screen relative">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Hamburger Menu Button */}
        <button
          className="md:hidden p-2 mb-4 text-zinc-100"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {children}
      </main>
    </div>
  );
};

export default Layout;
