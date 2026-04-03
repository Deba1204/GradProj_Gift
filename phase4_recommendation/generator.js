const { Groq } = require('groq-sdk');

class RecommendationGenerator {
    constructor(apiKey) {
        this.groq = new Groq({ apiKey });
    }

    /**
     * Calls the Groq LLM API to generate gift suggestions based on context and user profile.
     * @param {Object} profile - User profile containing giftFor, interests, occasion, budget.
     * @param {string} datasetContext - The stringified CSV data to provide context to the LLM.
     * @returns {Promise<Array>} - Resolves to an array of suggestion objects { giftName, reason }.
     */
    async generateSuggestions(profile, datasetContext) {
        if (!profile) throw new Error("Profile is required.");
        if (!datasetContext) throw new Error("Dataset context is required.");

        const systemPrompt = `You are an expert gifting assistant. 
You will be provided with a dataset of gift ideas.
Your goal is to recommend 3 personalized gift ideas for the user based on their profile.
Match the user's profile with the closest items in the dataset or extrapolate creatively based on the dataset's themes.
Return the suggestions as a structured JSON array of objects, with exactly two keys: 'giftName' and 'reason'.
Dataset Context:
\n${datasetContext}`;

        const userPrompt = `User Profile:
- Gift For: ${profile.giftFor}
- Interests: ${profile.interests}
- Occasion: ${profile.occasion}
- Budget: ${profile.budget}

Generate exactly valid JSON (an object containing an array called "suggestions" where each element has 'giftName' and 'reason').`;

        const chatCompletion = await this.groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            // Use an active groq model like llama-3.1-8b-instant
            model: 'llama-3.1-8b-instant', 
            response_format: { type: "json_object" }
        });

        const replyContent = chatCompletion.choices[0]?.message?.content;
        if (!replyContent) {
            throw new Error("No content received from AI.");
        }
        
        let parsed = {};
        try {
            parsed = JSON.parse(replyContent);
        } catch(e) {
            throw new Error("Failed to parse JSON from AI.");
        }

        // Handle various JSON wrapper formats naturally returned by LLMs
        let suggestions = [];
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
            suggestions = parsed.suggestions;
        } else if (Array.isArray(parsed)) {
            suggestions = parsed;
        }

        return suggestions;
    }
}

module.exports = { RecommendationGenerator };
