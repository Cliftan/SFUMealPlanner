const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

let conversationHistory = [
    {
        role: "system",
        content: "I am a helpful meal planner bot to answer any questions with meal planning."
    }
];

export async function processMessageToChatGPT(userMessage) {

    conversationHistory.push({
        role: "user",
        content: userMessage
    });

    const apiRequestBody = {
        "model": "gpt-4o-mini",
        "messages": conversationHistory
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        });

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            // Return the assistant's response
            const response =  data.choices[0].message.content.replace(/\*\*(.*?)\*\*/g, "$1");

            conversationHistory.push({
                role: "assistant",
                content: response
            });

            return response;
        } else {
            console.error("Unexpected API response format:", data);
            return "Sorry, I couldn't process your request.";
        }
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        return "Sorry, there was an error processing your request.";
    }
}