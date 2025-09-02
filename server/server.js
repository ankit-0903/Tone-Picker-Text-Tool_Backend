const express = require('express');
const dotenv = require('dotenv');
const { AzureOpenAI } = require('openai');

// Load environment variables from a .env file
dotenv.config();

// --- Express App Initialization ---
const app = express();
// The port is now managed by Vercel, so we don't need to define it here.

// --- Azure OpenAI Client Initialization ---
if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
    console.error("FATAL ERROR: Azure OpenAI environment variables are not configured.");
}

const client = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: "2025-01-01-preview",
});


// --- Middleware ---
// Manual CORS middleware to handle preflight requests explicitly.
app.use((req, res, next) => {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Define allowed HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Define allowed headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // If this is a preflight (OPTIONS) request, end the request here with a 204 No Content status.
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());


// --- API Endpoint ---
app.post('/api/transform-tone', async (req, res) => {
  const { text, tone } = req.body;

  // --- Input Validation ---
  if (!text || !tone) {
    return res.status(400).json({ error: 'Text and tone are required fields.' });
  }
  if (text.length > 5000) {
    return res.status(400).json({ error: 'Input text exceeds the 5000 character limit.' });
  }

  // --- Prompt Engineering ---
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
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.2,
      max_tokens: 2048
    });

    const transformedText = response.choices[0]?.message?.content?.trim() || "";
    res.json({ transformedText });

  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to transform text due to a server error. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
