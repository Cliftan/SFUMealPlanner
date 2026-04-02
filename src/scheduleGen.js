const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function ScheduleGenerate(schedule, budget, amount, menu) {

    const message = `
        Here are a list of restaurents and their menu: ${JSON.stringify(menu)}
        Here is the user schedule: ${schedule}
        Here is the users budget: ${budget}
        Amount used = ${amount} 

        Please choose 3 to 4 menu options from the menu list and return it as json. 
        Things to consider while choosing:
        - campus must match
        - Amount used must be under or equal to budget. 
        - When chosing add the price of each item to amount used and see if it is over.

        How to return:
        - Return a list of objects in plain text format.
        - Add nothing new and only choose from the list provided. Format must be the same as the one in the list.
        - Do not add \"JSON\" or \`\`\` at the start or end.
    `;

    const apiRequestBody = {
        "model": "gpt-4o-mini",
        "messages": [{
            role: "user",
            content: message
        }]
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