export async function sendMessage(message, sessionId) {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: message, sessionId }),
  });
  return res.json();
}
