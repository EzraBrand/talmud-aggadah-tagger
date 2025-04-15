const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate tags for Talmudic text using OpenAI
 * @param {string} text - The Talmudic text to analyze
 * @param {string} translation - Optional English translation
 * @returns {Object} Tags and summary
 */
async function generateTags(text, translation = null) {
  try {
    const prompt = `
    Analyze the following Talmudic passage and generate appropriate tags according to these categories:
    
    Narrative Type: [historical account, parable, miracle, dialogue, etc.]
    Historical Context: [Second Temple, post-destruction, Roman occupation, etc.]
    Figures: [List all named individuals, rabbis, biblical figures, etc.]
    Locations: [List all mentioned locations]
    Thematic Elements: [divine justice, afterlife, wisdom, status, etc.]
    Literary Elements: [wordplay, numerical patterns, exaggeration, etc.]
    
    Also provide a brief 2-3 sentence summary of the passage.
    
    Passage: ${text}
    
    Translation (if available): ${translation || 'Not provided'}
    
    Format your response as a JSON object with the following structure:
    {
      "tags": {
        "narrative_type": [],
        "historical_context": [],
        "figures": [],
        "locations": [],
        "thematic_elements": [],
        "literary_elements": []
      },
      "summary": ""
    }
    `;

    const response = await openai.createCompletion({
      model: "text-davinci-003", // or gpt-4 if available to you
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.2,
    });

    try {
      return JSON.parse(response.data.choices[0].text.trim());
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return {
        tags: {
          narrative_type: [],
          historical_context: [],
          figures: [],
          locations: [],
          thematic_elements: [],
          literary_elements: []
        },
        summary: "Error processing the passage."
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

module.exports = { generateTags };
