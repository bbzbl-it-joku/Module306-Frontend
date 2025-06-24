import React from 'react';
import CreateTicket from '~/detailTicket/createTicket';

export function meta() {
  return [
    { title: "Create Ticket - Trackify  " },
    { name: "description", content: "Create a ticket!" },
  ];
}

export default function Home() {
  return <CreateTicket />;
}
