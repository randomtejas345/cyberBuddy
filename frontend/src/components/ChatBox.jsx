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
    <div className="p-4">
      <div className="border rounded p-2 h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-blue-500" : "text-green-600"}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about OWASP..."
        />
        <button className="bg-blue-600 text-white px-4 ml-2" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
