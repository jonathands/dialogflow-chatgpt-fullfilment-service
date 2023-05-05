const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/gpt-request', async (req, res) => {

  const prompt = req.body.prompt;
  const apiKey = process.env.API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';  
  
  const response = await axios.post(url, {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 50,
    n: 1,
    stop: '\n',
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const result = response.data.choices[0].message;
  console.log(result);
  console.log(response.data);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
