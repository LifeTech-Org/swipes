import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Admin from "./routes/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <App />,
  },
  { path: "/admin", element: <Admin /> },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
