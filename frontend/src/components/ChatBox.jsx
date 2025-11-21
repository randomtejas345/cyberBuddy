import { useState } from "react";
import { sendMessage } from "../api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sessionId = "demo-session";

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    const res = await sendMessage(input, sessionId);
    setMessages([...messages, newMessage, { role: "bot", text: res.answer }]);
  };

  return (
    <header className="header-compact glass neon-border">
      <div className="brand">
        <div className="logo">CB</div>
        <div>
          <div className="neon-text">cyberBuddy</div>
          <div className="meta">Omnitrix · Ultimate ChatGPT</div>
        </div>
      </div>
      <div className="meta">Status: <span style={{color:'var(--accent-1)', fontWeight:700}}>Online</span></div>
    </header>
  );
}
