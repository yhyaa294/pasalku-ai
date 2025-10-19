import React, { useState } from 'react';
import './App.css';
// import useTranslation from 'next-translate/useTranslation';

function getBackendUrl() {
  const viteUrl = import.meta?.env?.REACT_APP_BACKEND_URL;
  const craUrl = process?.env?.REACT_APP_BACKEND_URL;
  return viteUrl || craUrl || 'http://localhost:5000/api'; // Default to localhost
}

function App() {
  // const { t } = useTranslation('app');

  const [query, setQuery] = useState(''); // Initialize with empty string
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const res = await fetch(`${getBackendUrl()}/consult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, session_id: sessionId || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || 'Request failed');
      }
      const data = await res.json();
      setAnswer(data.answer || '');
      if (data.session_id) setSessionId(data.session_id);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.'); // Improved error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" data-testid="app-root">
      <h1 className="title" data-testid="title">Pasalku AI Consultation</h1>
      <form onSubmit={handleSubmit} className="form" data-testid="consult-form">
        <textarea
          data-testid="consult-input"
          className="textarea"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your legal question here..."
        />
        <div className="row">
          <input
            data-testid="session-id-input"
            className="input"
            placeholder="Session ID (optional)"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
          <button
            data-testid="submit-button"
            className="button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error" data-testid="error-box">{error}</div>
      )}
      {answer && (
        <div className="answer" data-testid="answer-box">
          <h3>AI Response</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
