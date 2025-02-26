import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! How can I assist you with tax today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = () => {
    if (userInput.trim()) {
      const newMessages = [
        ...messages,
        { sender: "user", text: userInput },
        { sender: "ai", text: "I will help with tax-related queries." },
      ];
      setMessages(newMessages);
      setUserInput("");
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>Tax Assistant</h2>
      </div>
      <div className="chatbox">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "user-msg" : "ai-msg"}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Ask me anything about taxes..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
