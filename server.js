const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // To use .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON body

// OpenAI Solution Endpoint
app.post('/suggest-solution', async (req, res) => {
  const { description } = req.body;

  // Validate request
  if (!description || description.trim() === "") {
    return res.status(400).json({ error: "Bug description is required." });
  }

  try {
    // Make API request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: "text-davinci-003",
        prompt: `Provide a solution for the following bug:\n\n"${description}"`,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Updated key name for clarity
          'Content-Type': 'application/json',
        }
      }
    );

    const solution = response.data.choices[0].text.trim();
    res.json({ solution });
  } catch (error) {
    console.error("Error fetching AI solution:", error.message);

    // Distinguish between client and server errors
    if (error.response) {
      const { status, data } = error.response;
      res.status(status).json({ error: data.error || "Error fetching solution from OpenAI." });
    } else {
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: "Server is running successfully." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
