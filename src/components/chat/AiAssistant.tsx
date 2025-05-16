import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { source: string; page: string }[];
}

// Helper to strip markdown-style symbols
const stripMarkdown = (text: string) => {
  return text.replace(/[*_`~]/g, "");
};

const AiAssistant = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/query", {
        session_id: sessionId,
        query: input,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
        sources: response.data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 flex flex-col min-h-[80vh]">
        <h2 className="text-3xl font-bold mb-6">💬 AI Assistant</h2>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={`p-4 rounded-lg max-w-[70%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100 text-right"
                    : "mr-auto bg-gray-200 text-left"
                }`}
              >
                {stripMarkdown(msg.content)}
              </div>

              {/* Sources */}
              {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                <div className="text-xs text-gray-500 mt-2 ml-2">
                  <strong>Sources:</strong>
                  <ul className="list-disc list-inside">
                    {msg.sources.map((source, idx2) => (
                      <li key={idx2}>
                        <a
                          href={`/docs/${source.source}`}
                          download
                          className="text-blue-600 hover:underline"
                        >
                          {source.source}
                        </a>
                        {source.page !== "N/A" && ` (Page ${source.page})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 text-sm">AI is typing...</div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex mt-6">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
