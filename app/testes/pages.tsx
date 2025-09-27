'use client';

import { useState } from 'react';

export default function TestesAPI() {
  const [endpoint, setEndpoint] = useState('/api/auth/register');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [body, setBody] = useState<string>(
    JSON.stringify(
      { email: 'usuario@example.com', password: 'senha123', role: 'patient' },
      null,
      2
    )
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  async function run() {
    setLoading(true);
    setStatus('');
    setOutput('');
    try {
      const init: RequestInit = {
        method,
        headers: method !== 'GET' ? { 'Content-Type': 'application/json' } : undefined,
        body: method !== 'GET' ? body : undefined,
      };
      const res = await fetch(endpoint, init);
      setStatus(`${res.status} ${res.statusText}`);
      const text = await res.text();
      setOutput(text);
    } catch (e: any) {
      setStatus('Erro na requisição');
      setOutput(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: '24px auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1>Testes de API</h1>

      <label>Endpoint</label>
      <select
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12 }}
      >
        <option value="/api/auth/register">/api/auth/register</option>
        <option value="/api/patients">/api/patients</option>
        <option value="/api/evaluations">/api/evaluations</option>
      </select>

      <label>Método</label>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as any)}
        style={{ display: 'block', width: '100%', marginBottom: 12 }}
      >
        <option>POST</option>
        <option>GET</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>

      {method !== 'GET' && (
        <>
          <label>Body (JSON)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            spellCheck={false}
            style={{ width: '100%', marginBottom: 12, fontFamily: 'ui-monospace' }}
          />
        </>
      )}

      <button onClick={run} disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Enviando...' : 'Executar requisição'}
      </button>

      {status && (
        <p style={{ marginTop: 12 }}>
          <strong>Status:</strong> {status}
        </p>
      )}

      {output && (
        <>
          <label>Resposta</label>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#111827',
              color: '#e5e7eb',
              padding: 12,
              borderRadius: 8,
            }}
          >
            {output}
          </pre>
        </>
      )}
    </div>
  );
}