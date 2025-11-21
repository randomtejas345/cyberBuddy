import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ScrollArea } from "./components/ui/scroll-area";

const API_URL = "http://localhost:5000/api/chat";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm **CyberBuddy**, your CTF and OWASP assistant. Ask me about vulnerabilities, challenge walkthroughs, or security concepts.",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [retryCount, setRetryCount] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchWithRetry(url, options, attempt = 1) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      if (attempt < MAX_RETRIES) {
        console.warn(`Retry attempt ${attempt}/${MAX_RETRIES}:`, e.message);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt));
        return fetchWithRetry(url, options, attempt + 1);
      }
      throw e;
    }
  }

  async function handleSend(text) {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg, { role: "assistant", content: "⏳ Processing...", timestamp: new Date() }]);
    setLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      const data = await fetchWithRetry(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify({ query: text, sessionId, timestamp: new Date().toISOString() }),
      });

      const answer = data.answer ?? "No response received.";

      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: answer, timestamp: new Date() };
        return copy;
      });
    } catch (e) {
      const errorMsg = `**Error:** ${e.message}`;
      console.error("Chat error:", e);
      setError(e.message);

      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: errorMsg,
          timestamp: new Date(),
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  const messageCount = messages.length;
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="dark flex h-screen flex-col bg-background text-foreground">
      <ChatHeader sessionId={sessionId} />
      <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
        Session ID: <code>{sessionId.slice(0, 8)}...</code> | Messages: {messageCount} | User Queries: {userMessageCount}
        {error && <div className="mt-1 text-red-500">⚠️ {error}</div>}
      </div>
      <ScrollArea ref={scrollRef} className="flex-1">
        {messages.map((m, idx) => (
          <ChatMessage key={idx} role={m.role} content={m.content} timestamp={m.timestamp} />
        ))}
      </ScrollArea>
      <ChatInput onSend={handleSend} loading={loading} disabled={loading} />
    </div>
  );
}
