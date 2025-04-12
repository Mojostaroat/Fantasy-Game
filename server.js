const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });
const narrativeModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const imageGenerationConfig = { temperature: 1, topP: 0.95, topK: 40, maxOutputTokens: 8192, responseModalities: ['image', 'text'], responseMimeType: 'text/plain' };
const narrativeGenerationConfig = { temperature: 1, topP: 0.95, topK: 40, maxOutputTokens: 8192, responseModalities: [], responseMimeType: 'text/plain' };

app.use(express.json());

app.post('/generate-scene-image', async (req, res) => {
  const { prompt } = req.body;
  try {
    const session = imageModel.startChat({ generationConfig: imageGenerationConfig, history: [] });
    const result = await session.sendMessage(prompt);
    // Save image file from inlineData...
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/generate-narrative', async (req, res) => {
  const { prompt, history } = req.body;
  try {
    const session = narrativeModel.startChat({ generationConfig: narrativeGenerationConfig, history });
    const result = await session.sendMessage(prompt);
    res.status(200).send(result.response.text());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
