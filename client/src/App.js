import React, { useState, useEffect } from 'react';
import './App.css';
import TextViewer from './components/TextViewer';
import { fetchText, tagPassage, fetchTags, savePassageTags, searchByTags } from './services/api';

function App() {
  const [reference, setReference] = useState('Sanhedrin.38a');
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState('');
  const [tags, setTags] = useState(null);
  const [availableTags, setAvailableTags] = useState(null);
  const [currentPassageId, setCurrentPassageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Load available tags on component mount
  useEffect(() => {
    loadAvailableTags();
  }, []);

  const loadAvailableTags = async () => {
    try {
      const tagData = await fetchTags();
      setAvailableTags(tagData.categories);
    } catch (err) {
      console.error('Error loading tags:', err);
      setError('Error loading available tags');
    }
  };

  const handleReferenceChange = (e) => {
    setReference(e.target.value);
  };

  const loadText = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchText(reference);
      setText(data.he || '');
      setTranslation(data.text || '');
      setCurrentPassageId(data._id);
      
      // Automatically generate tags for the loaded text
      const tagData = await tagPassage(data.he, data.text);
      setTags(tagData.tags);
    } catch (err) {
      setError('Error loading text. Please check the reference and try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagsUpdate = async (selectedText, category, tag) => {
    if (!currentPassageId) return;

    const updatedTags = {
      ...tags,
      [category]: [...(tags[category] || []), tag],
      selections: [...(tags.selections || []), {
        text: selectedText.text,
        type: selectedText.type,
        category,
        tag,
        range: {
          start: selectedText.start,
          end: selectedText.end
        }
      }]
    };

    setTags(updatedTags);

    try {
      await savePassageTags(currentPassageId, updatedTags);
    } catch (err) {
      console.error('Error saving tags:', err);
      setError('Error saving tags');
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length === 0) return;

    setIsLoading(true);
    try {
      const results = await searchByTags(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching passages:', err);
      setError('Error searching passages');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Talmud Aggadah Tagger</h1>
      </header>
      <main>
        <div className="search-section">
          <select
            multiple
            value={searchQuery}
            onChange={(e) => setSearchQuery(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {availableTags && Object.entries(availableTags).map(([category, tagList]) => (
              <optgroup key={category} label={category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}>
                {tagList.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button onClick={handleSearch} disabled={isLoading || searchQuery.length === 0}>
            Search by Tags
          </button>
        </div>

        <div className="reference-input">
          <label htmlFor="reference">Talmud Reference:</label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={handleReferenceChange}
            placeholder="e.g., Sanhedrin.38a"
          />
          <button onClick={loadText} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <TextViewer
          text={text}
          translation={translation}
          isLoading={isLoading}
          tags={availableTags}
          onTagsUpdate={handleTagsUpdate}
        />
        
        {tags && (
          <div className="tags-section">
            <h3>Current Tags</h3>
            {Object.entries(tags).map(([category, tagList]) => (
              category !== 'selections' && (
                <div key={category} className="tag-category-display">
                  <h4>{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                  <div className="tag-list-display">
                    {tagList.map(tag => (
                      <span key={tag} className="tag-display">{tag}</span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            {searchResults.map(result => (
              <div key={result._id} className="search-result-item">
                <h4>{result.reference}</h4>
                <p>{result.text}</p>
                <button onClick={() => {
                  setReference(result.reference);
                  loadText();
                }}>
                  Load Passage
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
