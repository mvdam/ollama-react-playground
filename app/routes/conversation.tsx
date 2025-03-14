import type { Route } from "./+types/home";
import { Chat } from "../chat/chat";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ollama Chat" },
    { name: "description", content: "Chat with Ollama!" },
  ];
}

export default function Conversation() {
  return <Chat />;
}
