import React from 'react';
import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "Trackify  " },
    { name: "description", content: "Welcome to Trackify!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
