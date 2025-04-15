import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch text from Sefaria
export const fetchText = async (reference) => {
  try {
    const response = await apiClient.get(`/texts/${encodeURIComponent(reference)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching text:', error);
    throw error;
  }
};

// Tag a passage using OpenAI
export const tagPassage = async (text, translation = null) => {
  try {
    const response = await apiClient.post('/tag-passage', {
      text,
      translation
    });
    return response.data;
  } catch (error) {
    console.error('Error tagging passage:', error);
    throw error;
  }
};

// Get all tags for filtering
export const fetchTags = async () => {
  try {
    const response = await apiClient.get('/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Save user-edited tags for a passage
export const savePassageTags = async (passageId, tags) => {
  try {
    const response = await apiClient.put(`/passages/${passageId}/tags`, { tags });
    return response.data;
  } catch (error) {
    console.error('Error saving tags:', error);
    throw error;
  }
};

// Search passages by tags
export const searchByTags = async (tags, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/passages/search', {
      params: {
        tags: tags.join(','),
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching passages:', error);
    throw error;
  }
};
