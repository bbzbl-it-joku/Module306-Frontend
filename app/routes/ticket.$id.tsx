import { TicketDetail } from "../detailTicket/detailTicket";
import React
 from "react";
export function meta() {  return [
    { title: `Ticket details - Trackify` },
    { name: "description", content: "Detailed view of ticket with comments and attachments" },
  ];
}

export default function TicketDetailRoute() {
  return <TicketDetail />;
}