// src/pages/assistant.tsx
import AiAssistant from "@/components/chat/AiAssistant";

export default function AssistantPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full">
        <AiAssistant />
      </div>
    </div>
  );
}
