import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-3xl gap-2">
        <Textarea
          placeholder="Ask about OWASP or CTF challenges..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[60px] max-h-[200px] resize-none"
        />
        <Button onClick={handleSend} disabled={loading} size="icon" className="h-[60px] w-[60px]">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
