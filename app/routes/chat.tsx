import type { Route } from "./+types/home";
import ChatPage from "../chat/chat-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat" },
    { name: "description", content: "Chat with Ollama or Mistral!" },
  ];
}

export default function ChatRoute() {
  return <ChatPage />;
}
