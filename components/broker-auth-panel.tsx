'use client';

import { useState } from 'react';

export function BrokerAuthPanel() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleLinkTerminal(e: React.FormEvent) {
    e.preventDefault();
    if (!login || !password || !server) {
      setResponseMsg('Please fill out all access parameters.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setResponseMsg('Authorizing terminal socket link...');
    
    try {
      const res = await fetch('http://127.0.0.1:5000/api/connect-broker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, server })
      });
      
      const data = await res.json();
      setResponseMsg(data.message);
      setIsSuccess(res.ok);
    } catch (error) {
      setResponseMsg('Failed to communicate with local trading server.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-foreground">Broker Access Matrix</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Switch accounts or pass credentials to MT5 live</p>
      </div>

      <form onSubmit={handleLinkTerminal} className="space-y-3.5">
        <div>
          <input
            type="number"
            placeholder="MT5 Login ID"
            className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Trading Password"
            className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Server (e.g., Exness-MT5-Trial9)"
            className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            value={server}
            onChange={(e) => setServer(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-black text-xs font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
        >
          {loading ? 'Authenticating Secure Handshake...' : 'Connect Live Instance'}
        </button>

        {responseMsg && (
          <p className={`text-[11px] font-mono mt-2 text-center ${isSuccess ? 'text-emerald-400' : 'text-amber-400'}`}>
            ⚡ {responseMsg}
          </p>
        )}
      </form>
    </div>
  );
}