import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App";
import AdminPortal from "./pages/AdminPortal";
import UserPortal from "./pages/UserPortal";
import CourseView from "./pages/CourseView";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/learn" replace /> },
      { path: "admin", element: <AdminPortal /> },
      { path: "learn", element: <UserPortal /> },
      { path: "learn/:id", element: <CourseView /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
