import ConversationPage from "~/conversation/conversation-page";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conversation" },
    { name: "description", content: "Let AIs talk to each other!" },
  ];
}

export default function Conversation() {
  return <ConversationPage />;
}
