import { TicketDetail } from "../detailTicket/detailTicket";
import type { Route } from "./+types/ticket.$id";

export function meta({ matches }: Route.MetaArgs) {  return [
    { title: `Ticket ${matches[1].id} - Trackify` },
    { name: "description", content: "Detailed view of ticket with comments and attachments" },
  ];
}

export default function TicketDetailRoute() {
  return <TicketDetail />;
}