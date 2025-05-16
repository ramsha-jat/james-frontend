import { useState } from "react";
import API from "@/lib/axios";

interface Props {
  sessionId: string;
}

const DocumentChat = ({ sessionId }: Props) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const res = await API.post("/chat_with_document", {
        session_id: sessionId,
        question,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);

      setQuestion("");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Error getting answer");
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-xl font-bold">Chat with Document</h3>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask something about the document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

      {/* Chat Display */}
      <div className="bg-gray-50 rounded p-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentChat;
