import type { ReactNode } from "react";
import { AdventureTopBar } from "@/components/AdventureTopBar/AdventureTopBar";
import { LayoutContainer, MainContent } from "./AdventureLayout.styles";

interface AdventureLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export const AdventureLayout = ({
  sidebar,
  children,
}: AdventureLayoutProps) => {
  return (
    <>
      <AdventureTopBar />
      <LayoutContainer>
        {sidebar}
        <MainContent>{children}</MainContent>
      </LayoutContainer>
    </>
  );
};
