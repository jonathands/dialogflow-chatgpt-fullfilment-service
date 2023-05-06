const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post('/gpt-request', async (req, res) => {
  // const intentName = req.body.queryResult.intent.displayName;
  let prompt ;
  try {
    prompt = req.body.queryResult.queryText || null;
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('400 No message provided (invalid format)');
  }

  const apiKey = process.env.API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';  
  
  if (prompt == null || prompt.length == 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('400 No message provided');
    return
  }

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
  const dfResponse = {
    fulfillmentText: result.content
  };

  res.send(dfResponse);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
