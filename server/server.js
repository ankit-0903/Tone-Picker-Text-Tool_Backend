const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { AzureOpenAI } = require('openai');

// Load environment variables from a .env file
dotenv.config();

// --- Express App Initialization ---
const app = express();
// The port can be set in the .env file or defaults to 3001
const PORT = process.env.PORT || 3001;


// --- Azure OpenAI Client Initialization ---
// Ensure the required environment variables are set before proceeding
if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
    console.error("FATAL ERROR: Azure OpenAI environment variables are not configured.");
    console.error("Please ensure AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT_NAME are set in your .env file.");
    process.exit(1); // Exit the application if configuration is missing
}

const client = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: "2025-01-01-preview", // The API version from your reference
    // The deployment name is specified in the actual API call below
});


app.use(cors({
  origin: process.env.CLIENT_URL 
}));
// Parse incoming JSON requests, which is necessary for reading `req.body`
app.use(express.json());


// --- API Endpoint ---
// A POST route to handle tone transformation requests
app.post('/api/transform-tone', async (req, res) => {
  const { text, tone } = req.body;

  // --- Input Validation ---
  if (!text || !tone) {
    return res.status(400).json({ error: 'Text and tone are required fields.' });
  }
  if (text.length > 5000) { // Safety check for input length
    return res.status(400).json({ error: 'Input text exceeds the 5000 character limit.' });
  }


  // --- Prompt Engineering ---
  // This prompt structure is designed to constrain the model's output.
  const prompt = `[SYSTEM INSTRUCTION]
You are a text rewriting tool. Your sole function is to transform the given text into the specified tone.
Your response MUST ONLY be the rewritten text.
Do NOT, under any circumstances, output any introductory phrases, explanations, notes, quotes, or any text other than the final rewritten content.

[TASK]
Rewrite the text below in a '${tone}' tone.

[ORIGINAL TEXT]
"${text}"

[REWRITTEN TEXT]`;

  try {
    // --- Azure OpenAI API Call ---
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME, // Your GPT-5 deployment name
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.2, // A low value makes the output more focused and deterministic
      max_tokens: 2048 // It's good practice to set a limit on the output length
    });

    // --- Extract and Send the Response ---
    // The rewritten text is found in the 'content' of the first message choice
    const transformedText = response.choices[0]?.message?.content?.trim() || "";
    
    res.json({ transformedText });

  } catch (error) {
    // --- Error Handling ---
    console.error('Error calling Azure OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to transform text due to a server error. Please try again.' });
  }
});


module.exports = app;
