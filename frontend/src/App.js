import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("User " + Math.floor(Math.random() * 1000));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", { user, message });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-purple-300">
      <div className="bg-white shadow-2xl rounded-lg w-[90%] max-w-xl h-[80%] flex flex-col">
        <div className="p-4 bg-blue-600 text-white text-center rounded-t-lg font-bold">
          Realtime Chat App
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className="p-2 rounded bg-white shadow-sm">
              <strong className="text-blue-500">{msg.user}:</strong> {msg.message}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="p-4 flex gap-2 border-t">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
