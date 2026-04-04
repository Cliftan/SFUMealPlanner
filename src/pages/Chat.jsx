import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ChatbotIcon from "../components/ChatbotIcon.jsx";
import ChatForm from "../components/ChatForm";
import { useEffect, useState, useRef} from "react";
import ChatMessage from "../components/ChatMessage";
import { processMessageToChatGPT } from "../chatbot";
import "./Chat.css";

export default function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const generateBotResponse = async (userMessage) => {
    try {
      const botReply = await processMessageToChatGPT(userMessage);
      setChatHistory((history) => [
        ...history.slice(0, -1),
        { role: "model", text: botReply },
      ]);

      // Dispatch event to notify other components that preferences have been updated
      window.dispatchEvent(new Event("preferencesUpdated"));
    } catch (error) {
      setChatHistory((history) => [
        ...history.slice(0, -1),
        { role: "model", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />
        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
              <p className="message-text">
                Hi there, how can I help? Tell me your favourite foods, diet
                preferences or any issues you are having with pricing.
              </p>
          </div>
          {/* Dynamic chat history */}
          {chatHistory.map((chat, index) => (
            <div key={index} ref={index === chatHistory.length - 1 ? lastMessageRef : null}>
              <ChatMessage chat={chat} />
            </div>
          ))}
        </div>
        {/* Chat input lives above the bottom nav */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}