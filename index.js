require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = []; // Store URLs with a short id

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const urlPattern = /^(http|https):\/\/[^ "]+$/;

  // Check if the URL is valid
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Create a short URL ID
  const shortUrl = urlDatabase.length + 1;
  urlDatabase.push({ originalUrl, shortUrl });

  // Return the original URL and short URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const entry = urlDatabase.find(item => item.shortUrl === shortUrl);

  // If the short URL is not found, return an error
  if (!entry) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  // Redirect to the original URL
  res.redirect(entry.originalUrl);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
