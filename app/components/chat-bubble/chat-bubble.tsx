import ollamaLogo from "./ollama.png";
import meIcon from "./me.png";

type ChatBubbleProps = {
  name: string;
  isAgent: boolean;
  time: string;
  messages: string[];
};

export function ChatBubble({ name, isAgent, time, messages }: ChatBubbleProps) {
  return (
    <div
      className="flex items-start gap-2.5"
      style={{ clear: "both", float: isAgent ? "left" : "right" }}
    >
      {isAgent && (
        <div
          className="w-8 h-8 rounded-full"
          style={{
            backgroundColor: "white",
            padding: "2px",
          }}
        >
          <img src={isAgent ? ollamaLogo : meIcon} alt="Ollama" />
        </div>
      )}

      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {time}
          </span>
        </div>
        {messages.map((message, index) => (
          <p
            key={index}
            className="text-sm font-normal py-2.5 text-gray-900 dark:text-white"
          >
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
