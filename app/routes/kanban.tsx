import React from 'react';
import KanbanBoard from "../kanban/kanban";

export function meta() {
  return [
    { title: "Kanabn - Trackify  " },
    { name: "description", content: "Kanban board!" },
  ];
}

export default function Home() {
  return <KanbanBoard />;
}
