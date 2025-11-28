import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const AppContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const AppContent = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${getColor("background", "neutral")};
`;
