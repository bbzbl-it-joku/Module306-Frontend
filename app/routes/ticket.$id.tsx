import { TicketDetail } from "../detailTicket/detailTicket";
import type { Route } from "./+types/ticket.$id";

export function meta({}: Route.MetaArgs) {  return [
    { title: `Ticket details - Trackify` },
    { name: "description", content: "Detailed view of ticket with comments and attachments" },
  ];
}

export default function TicketDetailRoute() {
  return <TicketDetail />;
}