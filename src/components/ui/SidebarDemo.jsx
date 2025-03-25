"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="text-neutral-800 dark:text-neutral-200" />
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="text-neutral-800 dark:text-neutral-200" />
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogOut className="text-neutral-800 dark:text-neutral-200" />
    }
  ];

  return (
    <Sidebar>
      <SidebarBody>
        <div className="flex flex-col space-y-2">
          {links.map((link) => (
            <SidebarLink key={link.label} link={link} />
          ))}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}