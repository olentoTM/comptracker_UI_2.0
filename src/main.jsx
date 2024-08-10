import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import SessionResults from "./routes/sessionResults.jsx";
import TournamentResults from "./routes/tournamentResults.jsx";
import OrganizerHome from "./routes/organizerHome.jsx";
import { Signal } from "lucide-react";

const serviceurl = import.meta.env.VITE_SERVICE_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <OrganizerHome />,
  },
  {
    path: "/tournament/:id",

    element: <TournamentResults />,
  },
  {
    path: "/session/:id",
    element: <SessionResults />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
