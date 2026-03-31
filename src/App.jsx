import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import { useEffect, useState, useRef} from "react";
import ChatMessage from "./components/ChatMessage";
import { processMessageToChatGPT } from "./chatbot";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView(true);
  }, [chatHistory]);

  const generateBotResponse = async(userMessage) => {
    try {
      const botReply = await processMessageToChatGPT(userMessage);

      setChatHistory((history) => [
        ...history.slice(0, -1),
        { role: "model", text: botReply }
      ]);
    } catch (error) {
      setChatHistory((history) => [
        ...history.slice(0, -1),
        { role: "model", text: "Sorry, something went wrong." }
      ]);
    }
  };

  return <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
    <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
      <span className="material-symbols-rounded">mode_comment</span>
      <span className="material-symbols-rounded">close</span>
    </button>

    <div className="chatbot-popup">
      {/* Chatbot Header */}
      <div className="chat-header">
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">Chatbot</h2>
        </div>
        <button onClick={() => setShowChatbot(prev => !prev)} className="material-symbols-rounded">
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
          <div key={index} ref={index === chatHistory.length - 1 ? lastMessageRef : null}>
          <ChatMessage chat={chat} />
          </div>
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