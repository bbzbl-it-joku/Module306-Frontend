import type { Route } from "./+types/dashboard";
import { Dashboard } from "../dashboard/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Trackify" },
    { name: "description", content: "Project overview and ticket management dashboard" },
  ];
}

export default function DashboardRoute() {
  return <Dashboard />;
}