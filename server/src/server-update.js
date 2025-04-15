// Add these lines near the top of server.js
const openaiService = require('./services/openaiService');

// Add this endpoint after your existing endpoints
// Endpoint to tag a passage
app.post('/api/tag-passage', async (req, res) => {
  try {
    const { text, translation } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const tagResult = await openaiService.generateTags(text, translation);
    res.json(tagResult);
  } catch (error) {
    console.error('Error tagging passage:', error);
    res.status(500).json({ 
      error: 'Error tagging passage', 
      details: error.message 
    });
  }
});
