// server.js - A proxy server for the Sefaria API and tagging system
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Base URL for Sefaria API
const SEFARIA_API_BASE = 'https://www.sefaria.org/api/';

// Proxy route for texts
app.get('/api/texts/:ref', async (req, res) => {
  try {
    const { ref } = req.params;
    const response = await axios.get(`${SEFARIA_API_BASE}texts/${encodeURIComponent(ref)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Sefaria API:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Error fetching from Sefaria API',
      details: error.message
    });
  }
});

// Proxy route for index information
app.get('/api/index/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(`${SEFARIA_API_BASE}index/${encodeURIComponent(title)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching index from Sefaria API:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Error fetching index from Sefaria API',
      details: error.message
    });
  }
});

// Add a test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'API server is working!' });
});

// Add an endpoint for your tagging system
app.get('/api/tags', (req, res) => {
  // This would connect to your tagging database
  // For now, just return some sample tags
  res.json({
    categories: {
      narrative_type: ['Historical account', 'Parable', 'Dialogue', 'Miracle'],
      figures: ['King David', 'Rabbi Akiva', 'Moses', 'Hillel'],
      locations: ['Jerusalem', 'Babylonia', 'Rome', 'Egypt'],
      thematic_elements: ['Divine justice', 'Wisdom', 'Afterlife', 'Prophecy'],
      literary_elements: ['Wordplay', 'Metaphor', 'Numerical patterns', 'Exaggeration'],
    }
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/api/test`);
});
