import { useRef } from 'react'
import { processMessageToChatGPT } from '../chatbot';

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
            inputRef.current.value = "";

        // Upadte chat history with the user's message
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        // Delay 600ms
        setTimeout(() => {
            // Add a "Thinking..." placeholder for the bot's response
            setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

            // Call the function to generate the bot's response
            generateBotResponse(userMessage);
        },  600);
    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
          <input ref={inputRef} type="text" placeholder="For this week's meal options..." className="message-input" required />
          <button type='button' className="material-symbols-rounded">
            upload
          </button>
          <button className="material-symbols-rounded">
            arrow_upward
          </button>
        </form>
    )
}

export default ChatForm