import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App, { AdventureLayout } from "./App.tsx";
import { AdventureManager } from "@/components/AdventureManager/AdventureManager";
import { TestAdventure } from "@/components/TestAdventure/TestAdventure";
import { AdventureContent } from "@/components/AdventureContent/AdventureContent";
import { ROUTES } from "@/constants/routes";

// Set the basename for GitHub Pages
const basename = import.meta.env.PROD ? "/adventure-book" : "";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <AdventureManager />,
        },
        {
          path: "adventure/:adventureId",
          element: <AdventureLayout />,
          children: [
            {
              path: "test",
              element: <Navigate to="introduction" replace />,
            },
            {
              path: "test/introduction",
              element: <TestAdventure />,
            },
            {
              path: "test/passage/:id",
              element: <TestAdventure />,
            },
            {
              path: "content",
              element: <Navigate to="introduction" replace />,
            },
            {
              path: "content/introduction",
              element: <AdventureContent />,
            },
            {
              path: "content/passage/:id",
              element: <AdventureContent />,
            },
            {
              path: "structure",
              element: <div>Structure view coming soon</div>,
            },
            {
              path: "*",
              element: <Navigate to="test/introduction" replace />,
            },
          ],
        },
        {
          path: "*",
          element: <Navigate to={ROUTES.ROOT} replace />,
        },
      ],
    },
  ],
  { basename }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
