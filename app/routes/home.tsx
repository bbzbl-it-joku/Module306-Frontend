import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trackify  " },
    { name: "description", content: "Welcome to Trackify!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
