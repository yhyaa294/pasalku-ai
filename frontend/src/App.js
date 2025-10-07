import React, { useState } from 'react';
import './App.css';

function getBackendUrl() {
  // Prefer Vite-style env, then CRA
  const viteUrl = import.meta && import.meta.env && import.meta.env.REACT_APP_BACKEND_URL;
  const craUrl = process && process.env && process.env.REACT_APP_BACKEND_URL;
  return (viteUrl || craUrl || '') + '/api';
}

function App() {
  const [query, setQuery] = useState('Apa saja syarat mendirikan PT di Indonesia?');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" data-testid="app-root">
      <h1 className="title" data-testid="title">Pasalku.ai - Legal AI Consultation</h1>
      <form onSubmit={handleSubmit} className="form" data-testid="consult-form">
        <textarea
          data-testid="consult-input"
          className="textarea"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tulis pertanyaan hukum Anda di sini..."
        />
        <div className="row">
          <input
            data-testid="session-id-input"
            className="input"
            placeholder="Session ID (opsional)"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
          <button
            data-testid="submit-button"
            className="button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Menganalisis...' : 'Konsultasi'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error" data-testid="error-box">{error}</div>
      )}
      {answer && (
        <div className="answer" data-testid="answer-box">
          <h3>Jawaban</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
