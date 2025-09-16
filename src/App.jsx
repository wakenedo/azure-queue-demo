import "./App.css";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message) return;
    await fetch("http://localhost:3001/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setMessage("");
    fetchMessages();
  };

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:3001/messages");
    const data = await res.json();
    setMessages(data);
  };

  const deleteMessage = async (msg) => {
    await fetch("http://localhost:3001/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: msg.messageId,
        popReceipt: msg.popReceipt,
      }),
    });
    fetchMessages();
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Azure Queue Storage Demo</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem"
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>

      <button onClick={fetchMessages} style={{ marginBottom: "1rem" }}>
        Atualizar Mensagens
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.length === 0 && <li>Nenhuma mensagem</li>}
        {messages.map((msg) => (
          <li
            key={msg.messageId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#f3f3f3",
              marginBottom: "4px",
              padding: "6px",
            }}
          >
            <span>{msg.messageText}</span>
            <button
              onClick={() => deleteMessage(msg)}
              style={{ background: "red", color: "white", border: "none" }}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
