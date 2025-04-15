const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../../data/tags-db.json');

/**
 * Get all tagged passages
 */
async function getAllTaggedPassages() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it
      await fs.writeFile(dbPath, JSON.stringify({ passages: [] }));
      return { passages: [] };
    }
    throw error;
  }
}

/**
 * Save a tagged passage
 */
async function saveTaggedPassage(reference, text, translation, tags, summary) {
  try {
    const db = await getAllTaggedPassages();
    
    // Check if this passage already exists
    const existingIndex = db.passages.findIndex(p => p.reference === reference);
    
    const passageData = {
      reference,
      text,
      translation,
      tags,
      summary,
      dateTagged: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing
      db.passages[existingIndex] = passageData;
    } else {
      // Add new
      db.passages.push(passageData);
    }
    
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    return passageData;
  } catch (error) {
    console.error('Error saving tagged passage:', error);
    throw error;
  }
}

module.exports = {
  getAllTaggedPassages,
  saveTaggedPassage
};
