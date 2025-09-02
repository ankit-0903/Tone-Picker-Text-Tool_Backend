const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Port can be set in .env file or defaults to 3001
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) to allow requests from our frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000' // Allow your frontend URL
}));
// Parse incoming JSON requests
app.use(express.json());


// --- API Endpoint ---
// A POST route to handle tone transformation requests
app.post('/api/transform-tone', async (req, res) => {
  const { text, tone } = req.body;

  // --- Input Validation ---
  if (!text || !tone) {
    return res.status(400).json({ error: 'Text and tone are required.' });
  }
  if (text.length > 5000) { // Safety check for input length
    return res.status(400).json({ error: 'Input text is too long.' });
  }


  // --- Prompt Engineering ---
  // This prompt structure works well for local models.
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
    // --- Ollama Local API Call ---
    // Note: No 'Authorization' header is needed for local Ollama.
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'mistral', // Your local model name
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: {
        temperature: 0.2 // A low value makes the output more focused and less random
      }
    });

    // --- Correctly Extract the Response from Ollama ---
    // Ollama's response structure is simpler: response.data.message.content
    const transformedText = response.data.message.content.trim();

    // Send the successful response back to the frontend
    res.json({ transformedText });

  } catch (error) {
    // --- Error Handling ---
    console.error('Error calling Ollama API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to transform text. Please try again.' });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});