import React, { useState } from 'react';
import './App.css';

function App() {
  const [reference, setReference] = useState('Sanhedrin.38a');

  const handleReferenceChange = (e) => {
    setReference(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Talmud Aggadah Tagger</h1>
      </header>
      <main>
        <div className="reference-input">
          <label htmlFor="reference">Talmud Reference:</label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={handleReferenceChange}
          />
          <button onClick={() => console.log("Loading:", reference)}>Load</button>
        </div>
        <div>
          <p>Text viewer will go here</p>
        </div>
      </main>
    </div>
  );
}

export default App;
