import { Ollama, type Message } from "ollama";

export const createOllamaClient = (initialContext: string[] = []) => {
  const client = new Ollama({ host: "http://127.0.0.1:11434" });
  const previousMessages: Message[] = initialContext.map((content) => ({
    role: "system",
    content,
  }));

  const chat = (message: string) => {
    previousMessages.push({
      role: "user",
      content: message,
    });

    return client.chat({
      model: "llama3:latest",
      messages: previousMessages,
      //   stream: true,
    });
  };

  return {
    client,
    chat,
  };
};
