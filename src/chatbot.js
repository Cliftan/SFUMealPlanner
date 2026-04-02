//Chatbot.js
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
let conversationHistory = [
    {
        role: "system",
        content: "You are a helpful meal planner bot. When users mention dietary restrictions, allergies, preferred foods, or foods to avoid, acknowledge these preferences and remember them. Extract any dietary restrictions (allergies, intolerances), preferred foods, or foods to avoid from the conversation."
    }
];

// Function to extract preferences from user message
function extractPreferences(userMessage) {
    const preferences = {
        dietRestrictions: [],
        preferred: [],
        avoid: []
    };

    // Common allergens and restrictions to look for
    const allergenPatterns = {
        allergens: ["allergic to", "allergy to", "intolerant to", "intolerance to", "can't eat", "cannot eat", "avoid"],
        restrictions: ["dairy", "eggs", "egg", "fish", "shellfish", "nuts", "peanuts", "gluten", "soy", "sesame", "vegetarian", "vegan"],
        preferred: ["love", "prefer", "favorite", "favourite", "enjoy", "like"],
        toAvoid: ["hate", "dislike", "don't like", "do not like", "avoid", "allergic", "allergy"]
    };

    const lowerMessage = userMessage.toLowerCase();

    // Check for allergens and restrictions
    allergenPatterns.restrictions.forEach(restriction => {
        if (lowerMessage.includes(restriction)) {
            // Check if it's in context of allergy or restriction
            if (lowerMessage.includes("allergic") || lowerMessage.includes("allergy") || 
                lowerMessage.includes("intolerant") || lowerMessage.includes("can't eat") ||
                lowerMessage.includes("cannot eat")) {
                const capitalized = restriction.charAt(0).toUpperCase() + restriction.slice(1);
                preferences.dietRestrictions.push(capitalized);
            }
        }
    });

    // Look for preferred foods
    if (lowerMessage.match(/(prefer|love|favorite|favourite|enjoy|like)\s+([^.,!?]+)/i)) {
        const matches = userMessage.match(/(prefer|love|favorite|favourite|enjoy|like)\s+([^.,!?]+)/gi);
        if (matches) {
            matches.forEach(match => {
                const food = match.replace(/(prefer|love|favorite|favourite|enjoy|like)\s+/i, "").trim();
                if (food && !preferences.preferred.includes(food)) {
                    preferences.preferred.push(food);
                }
            });
        }
    }

    // Look for foods to avoid
    if (lowerMessage.match(/(hate|dislike|don't like|do not like|avoid)\s+([^.,!?]+)/i)) {
        const matches = userMessage.match(/(hate|dislike|don't like|do not like|avoid)\s+([^.,!?]+)/gi);
        if (matches) {
            matches.forEach(match => {
                const food = match.replace(/(hate|dislike|don't like|do not like|avoid)\s+/i, "").trim();
                if (food && !preferences.avoid.includes(food)) {
                    preferences.avoid.push(food);
                }
            });
        }
    }

    return preferences;
}

// Function to update localStorage with preferences
function updatePreferences(preferences) {
    if (preferences.dietRestrictions.length > 0) {
        const stored = JSON.parse(localStorage.getItem("dietRestrictions") || "[]");
        const filtered = stored.filter(item => item !== "+ Custom");
        const updated = [...new Set([...filtered, ...preferences.dietRestrictions])];
        updated.push("+ Custom");
        localStorage.setItem("dietRestrictions", JSON.stringify(updated));
    }

    if (preferences.preferred.length > 0) {
        const stored = JSON.parse(localStorage.getItem("preferred") || "[]");
        const filtered = stored.filter(item => item !== "+ Custom");
        const updated = [...new Set([...filtered, ...preferences.preferred])];
        updated.push("+ Custom");
        localStorage.setItem("preferred", JSON.stringify(updated));
    }

    if (preferences.avoid.length > 0) {
        const stored = JSON.parse(localStorage.getItem("avoid") || "[]");
        const filtered = stored.filter(item => item !== "+ Custom");
        const updated = [...new Set([...filtered, ...preferences.avoid])];
        updated.push("+ Custom");
        localStorage.setItem("avoid", JSON.stringify(updated));
    }
}

export async function processMessageToChatGPT(userMessage) {
    // Extract preferences from user message
    const extractedPreferences = extractPreferences(userMessage);
    updatePreferences(extractedPreferences);

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