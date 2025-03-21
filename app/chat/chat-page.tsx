import { useRef, useState, type FormEvent } from "react";
import { createOllamaClient, Model, MODEL_OPTIONS } from "~/api/ollama";
import { ChatBubble } from "~/components/chat-bubble/chat-bubble";
import { getCurrentTimeFormatted } from "~/util/date";

import "./chat-page.css";
import type { Conversation } from "~/models/conversation";

const INITIAL_CONTEXT = [
  "Your name is Alice",
  //   "act extremely kind in your responses",
  //   "include a very bad joke in every response",
  "Antwoord alleen in het Nederlands",
];

const ollamaClient = createOllamaClient({
  initialContext: INITIAL_CONTEXT,
});

// https://reactrouter.com/home
// https://flowbite.com/docs/forms/select/
// https://github.com/ollama/ollama/blob/main/docs/api.md

const ChatPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation>([]);
  const [model, setModel] = useState<Model>(ollamaClient.getModel());

  const chatsRef = useRef<HTMLTableSectionElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addToConversation = (message: string, isAgent: boolean) => {
    setConversation((current) => [
      ...current,
      {
        isAgent,
        name: isAgent ? ollamaClient.getName() : "Me",
        messages: [message],
        time: getCurrentTimeFormatted(),
      },
    ]);
  };

  const changeModel = (model: Model) => {
    setModel(model);
    ollamaClient.changeModel(model);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    addToConversation(prompt, false);
    scrollToContent();

    const response = ollamaClient.chat(prompt);

    setPrompt("");

    const message = (await response).message;
    const isAgent = message.role === "assistant";
    addToConversation(message.content, isAgent);

    scrollToContent();
    setIsLoading(false);
    autoFocus();
  };

  const scrollToContent = () => {
    setTimeout(() => {
      if (chatsRef.current) {
        // fixme: this is not enough
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }
    }, 100);
  };

  const autoFocus = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <main className="flex items-center justify-center">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[800px] w-full space-y-6 px-4 container">
          <section className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4 form">
            <form onSubmit={onSubmit}>
              <label
                htmlFor="models"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a model
              </label>
              <select
                disabled={isLoading}
                id="models"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(ev) => changeModel(ev.target.value as Model)}
              >
                {MODEL_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    selected={option.value === model}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <br />
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  autoFocus={true}
                  disabled={isLoading}
                  autoComplete="off"
                  type="search"
                  id="search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Start the conversation!"
                  value={prompt}
                  onChange={(ev) => setPrompt(ev.target.value)}
                  required
                />
                <button
                  disabled={!prompt.length}
                  type="submit"
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Send
                </button>
              </div>
            </form>
          </section>
          <section className="space-y-4 chat" ref={chatsRef}>
            {conversation.map((conv, index) => (
              <ChatBubble
                key={index}
                isAgent={conv.isAgent}
                name={conv.isAgent ? "Ollama" : "Me"}
                time={conv.time}
                messages={conv.messages}
              />
            ))}
            {isLoading && (
              <div className="text-center" style={{ clear: "both" }}>
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
