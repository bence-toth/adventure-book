import type { ReactNode } from "react";
import { SidebarContainer } from "./Sidebar.styles";

export interface SidebarProps {
  // Content to display in the sidebar
  children: ReactNode;
}

// A generic sidebar component that provides a container for content.
// Can be used for navigation, information panels, etc.
export const Sidebar = ({ children }: SidebarProps) => {
  return <SidebarContainer as="aside">{children}</SidebarContainer>;
};
