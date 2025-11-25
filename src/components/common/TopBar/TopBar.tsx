import type { ReactNode } from "react";
import { TopBarContainer, TopBarStart, TopBarEnd } from "./TopBar.styles";

export interface TopBarProps {
  // Content to display at the start of the top bar (inline-start for RTL support)
  start?: ReactNode;
  // Content to display at the end of the top bar (inline-end for RTL support)
  end?: ReactNode;
}

// A generic top bar component that provides layout slots for start and end content.
// Can be used as a base for application headers, navigation bars, etc.
export const TopBar = ({ start, end }: TopBarProps) => {
  return (
    <TopBarContainer as="header">
      {start && <TopBarStart>{start}</TopBarStart>}
      {end && <TopBarEnd>{end}</TopBarEnd>}
    </TopBarContainer>
  );
};
