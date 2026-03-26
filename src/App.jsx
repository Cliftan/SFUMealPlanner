import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import { useState } from "react";
import ChatMessage from "./components/ChatMessage";
import { processMessageToChatGPT } from "./chatbot";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = async(history) => {
    await console.log(processMessageToChatGPT(history.toString()));
  }

  return <div className="container">
    <div className="chatbot-popup">
      {/* Chatbot Header */}
      <div className="chat-header">
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">Chatbot</h2>
        </div>
        <button className="material-symbols-outlined">
          keyboard_arrow_down
        </button>
      </div>

      {/* Chatbot Body */}
      <div className="chat-body">
        <div className="message bot-message">
          <ChatbotIcon />
          <p className="message-text">
            Hi there, how can I help? Tell <br /> me your favourite foods, diet <br /> preferences or any issues <br /> you are having with pricing.
          </p>
        </div>

        {/* Render the chat history dynamically */}
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Chatbot Footer */}
      <div className="chat-footer">
        <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
      </div>
    </div>
  </div>;
};

export default App