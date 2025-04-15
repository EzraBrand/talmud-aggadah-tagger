import axios from 'axios';

// This should be set to your proxy server URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Create API service for Sefaria texts
export const fetchText = async (reference) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/texts/${encodeURIComponent(reference)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching text:', error);
    throw error;
  }
};

// Tag a passage
export const tagPassage = async (text, translation = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tag-passage`, {
      text,
      translation
    });
    return response.data;
  } catch (error) {
    console.error('Error tagging passage:', error);
    throw error;
  }
};

// Get existing tags
export const fetchTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};
