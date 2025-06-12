import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/ticket/:id", "routes/ticket.$id.tsx"),
    route("/kanban", "routes/kanban.tsx"),
    route("/createTicket", "routes/createTicket.tsx"),
] satisfies RouteConfig;
