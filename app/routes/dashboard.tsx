import React from "react";
import { Dashboard } from "../dashboard/dashboard";

export function meta() {
  return [
    { title: "Dashboard - Trackify" },
    { name: "description", content: "Project overview and ticket management dashboard" },
  ];
}

export default function DashboardRoute() {
  return <Dashboard />;
}