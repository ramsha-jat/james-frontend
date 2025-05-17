import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { v4 as uuidv4 } from "uuid";
import { FaDownload } from "react-icons/fa";
import ChatSidebar from "./ChatSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  downloadable_refs?: DownloadableRef[];
}

interface Source {
  source: string;
  page: string;
  content: string;
  exact_page: string | number;
  downloadable: boolean;
}

interface DownloadableRef {
  filename: string;
  path: string;
  type: string;
  preview: string;
  page: string;
  download_url: string;
}

const AiAssistant = () => {
  const [sessionId, setSessionId] = useState<string>(() => {
    // Initialize with a new session ID if none exists
    const newId = uuidv4();
    // Don't store empty sessions in localStorage
    return newId;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load chat history when session changes
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        // Try to load from localStorage first
        const storedSession = localStorage.getItem(`chat_session_${sessionId}`);
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          setMessages(sessionData.messages || []);
        } else {
          // If not in localStorage, try to fetch from backend
          try {
            const response = await API.get(`/chat_history/${sessionId}`);
            const chatHistory = response.data.chat_history || [];
            setMessages(chatHistory);
            // Only store in localStorage if there are messages
            if (chatHistory.length > 0) {
              localStorage.setItem(`chat_session_${sessionId}`, JSON.stringify({
                messages: chatHistory,
                title: chatHistory[0]?.content?.slice(0, 30) + '...' || 'New Chat',
                lastMessage: chatHistory[chatHistory.length - 1]?.content?.slice(0, 30) + '...' || '',
                timestamp: new Date().toISOString()
              }));
            }
          } catch (error) {
            console.error('Error fetching from backend:', error);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        setMessages([]);
      }
    };

    if (sessionId) {
      loadChatHistory();
    }
  }, [sessionId]);

  // Save chat history when messages change
  useEffect(() => {
    if (sessionId && messages.length > 0) {  // Only save if there are messages
      const sessionData = {
        messages,
        title: messages[0]?.content?.slice(0, 30) + '...' || 'New Chat',
        lastMessage: messages[messages.length - 1]?.content?.slice(0, 30) + '...' || '',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(sessionData));
    } else if (sessionId && messages.length === 0) {
      // Remove empty sessions from localStorage
      localStorage.removeItem(`chat_session_${sessionId}`);
    }
  }, [sessionId, messages]);

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setInput("");
    // Don't store empty sessions in localStorage
  };

  const handleSessionSelect = (selectedSessionId: string) => {
    // Only allow selecting sessions that exist in localStorage
    const storedSession = localStorage.getItem(`chat_session_${selectedSessionId}`);
    if (storedSession) {
      setSessionId(selectedSessionId);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const response = await API.get(`/download-reference/${filename}`, {
        responseType: 'blob'
      });
      
      // Create a download link for PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download failed:', error);
      if (error.response?.status === 400) {
        alert('Only PDF files can be downloaded.');
      } else {
        alert('Failed to download the reference file.');
      }
    }
  };

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
        downloadable_refs: response.data.downloadable_refs || [],
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

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-[80%] rounded-lg p-4 ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 shadow-md"
          }`}
        >
          {/* Plain text message content */}
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {/* Sources Section - Simplified */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold mb-2">References:</h4>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-gray-500">({source.page})</span>
                    {source.downloadable && (
                      <button
                        onClick={() => handleDownload(source.source)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <FaDownload size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Downloadable References Section - Simplified */}
          {message.downloadable_refs && message.downloadable_refs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold mb-2">Available PDFs:</h4>
              <div className="flex flex-wrap gap-2">
                {message.downloadable_refs.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                    <span className="font-medium">{ref.filename}</span>
                    <button
                      onClick={() => handleDownload(ref.filename)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaDownload size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar
        currentSessionId={sessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>{renderMessage(message)}</div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
