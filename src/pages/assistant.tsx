// src/pages/assistant.tsx
import AiAssistant from "@/components/chat/AiAssistant";

export default function AssistantPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>
      <AiAssistant />
    </div>
  );
}
