'use client';

import { useState, useEffect } from 'react';

type Source = {
  id: string;
  name: string;
  domain: string;
  type: 'WEBSITE' | 'YOUTUBE';
  enabled: boolean;
};

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSource, setNewSource] = useState({ name: '', domain: '', type: 'WEBSITE' });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sources');
      if (!res.ok) throw new Error('Failed to fetch sources');
      const data = await res.json();
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource),
      });
      if (!res.ok) throw new Error('Failed to add source');
      setNewSource({ name: '', domain: '', type: 'WEBSITE' });
      fetchSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add source');
    }
  };

  const toggleEnabled = async (source: Source) => {
    try {
      const res = await fetch(`/api/admin/sources/${source.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...source, enabled: !source.enabled }),
      });
      if (!res.ok) throw new Error('Failed to update source');
      fetchSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update source');
    }
  };

  const deleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      const res = await fetch(`/api/admin/sources/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete source');
      fetchSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete source');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Sources</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleAddSource} className="mb-8 flex gap-4 items-center">
        <input
          placeholder="Name (e.g., Wikipedia)"
          value={newSource.name}
          onChange={e => setNewSource(prev => ({ ...prev, name: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Identifier (e.g., wikipedia.org or youtube.com/@Channel)"
          value={newSource.domain}
          onChange={e => setNewSource(prev => ({ ...prev, domain: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <select 
          value={newSource.type}
          onChange={e => setNewSource(prev => ({ ...prev, type: e.target.value as 'WEBSITE' | 'YOUTUBE' }))}
          className="border p-2 rounded"
        >
          <option value="WEBSITE">Website</option>
          <option value="YOUTUBE">YouTube Channel</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Source</button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Identifier</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Enabled</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sources.map(source => (
            <tr key={source.id} className="border-b">
              <td className="p-2">{source.name}</td>
              <td className="p-2 font-mono text-sm">{source.domain}</td>
              <td className="p-2 text-sm">{source.type}</td>
              <td className="p-2">
                <button 
                  onClick={() => toggleEnabled(source)} 
                  className={`text-sm px-3 py-1 rounded font-medium transition-colors ${
                    source.enabled 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {source.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </td>
              <td className="p-2">
                <button onClick={() => deleteSource(source.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
