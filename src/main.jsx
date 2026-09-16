import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Home from "./pages/Home/Home";
import Details from "./pages/Details/Details";
import Match from "./pages/Match/Match";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import "./index.css";

// configuracao das rotas no modo Data do React Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "filme/:id", element: <Details /> },
      { path: "match", element: <Match /> },
      { path: "perfil", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
