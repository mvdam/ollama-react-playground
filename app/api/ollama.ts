import { Ollama, type Message } from "ollama";

export const createOllamaClient = (config: ClientConfig) => {
  const initialContext = config.initialContext ?? [];
  const client = new Ollama({ host: "http://127.0.0.1:11434" });
  const previousMessages: Message[] = initialContext.map((content) => ({
    role: "system",
    content,
  }));
  let model = config.model ?? Model.llama3;

  const chat = async (message: string) => {
    const newMessage = {
      role: "user",
      content: message,
    };
    previousMessages.push(newMessage);

    const response = await client.chat({
      model,
      messages: previousMessages,
      //   stream: true,
    });

    const responseMessage = {
      role: "assistant",
      content: response.message.content,
    };
    previousMessages.push(responseMessage);

    return response;
  };

  const reset = () => {
    client.abort();
    return createOllamaClient(config);
  };

  const changeModel = (newModel: Model) => {
    model = newModel;
  };

  const getModel = () => model;

  const getName = () => config.name ?? String(model);

  return {
    client,
    chat,
    getModel,
    getName,
    changeModel,
    reset,
  };
};

export type Client = ReturnType<typeof createOllamaClient>;
export type ClientConfig = Partial<{
  initialContext: string[];
  model: Model;
  name: string;
}>;

export enum Model {
  llama3 = "llama3:latest",
  Mistral = "mistral",
}

export const MODEL_OPTIONS = [
  {
    label: "llama3",
    value: Model.llama3,
  },
  {
    label: "Mistral",
    value: Model.Mistral,
  },
];
