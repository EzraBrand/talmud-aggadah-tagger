import React, { useState } from 'react';
import './TextViewer.css';

const TextViewer = ({ text, translation, isLoading, tags, onTagsUpdate }) => {
  const [selectedText, setSelectedText] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagMenuPosition, setTagMenuPosition] = useState({ x: 0, y: 0 });

  if (isLoading) {
    return <div className="text-viewer-loading">Loading...</div>;
  }

  const handleTextSelection = (event, textType) => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText({
        text: selection.toString(),
        type: textType,
        start: range.startOffset,
        end: range.endOffset
      });
      
      setTagMenuPosition({
        x: rect.left + (rect.width / 2),
        y: rect.bottom
      });
      
      setShowTagMenu(true);
    }
  };

  return (
    <div className="text-viewer">
      <div className="text-viewer-original">
        <h3>Original Text</h3>
        <div 
          className="text-content hebrew-text"
          onMouseUp={(e) => handleTextSelection(e, 'original')}
        >
          {text}
        </div>
      </div>
      
      {translation && (
        <div className="text-viewer-translation">
          <h3>Translation</h3>
          <div 
            className="text-content"
            onMouseUp={(e) => handleTextSelection(e, 'translation')}
          >
            {translation}
          </div>
        </div>
      )}

      {showTagMenu && (
        <div 
          className="tag-menu"
          style={{
            position: 'fixed',
            left: `${tagMenuPosition.x}px`,
            top: `${tagMenuPosition.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="tag-menu-content">
            <h4>Add Tags</h4>
            {tags && Object.entries(tags).map(([category, tagList]) => (
              <div key={category} className="tag-category">
                <h5>{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                <div className="tag-list">
                  {tagList.map(tag => (
                    <button
                      key={tag}
                      className="tag-button"
                      onClick={() => {
                        onTagsUpdate(selectedText, category, tag);
                        setShowTagMenu(false);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button 
              className="close-menu"
              onClick={() => setShowTagMenu(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextViewer;