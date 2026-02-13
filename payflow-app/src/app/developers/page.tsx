"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

type ApiKey = {
  id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

export default function Developers() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("Default");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        loadApiKeys(data.user.id);
      }
    });
  }, [router]);

  async function loadApiKeys(userId: string) {
    const { data } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setApiKeys(data);
    setLoading(false);
  }

  function generateKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "pk_live_";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  async function createApiKey() {
    const fullKey = generateKey();
    const prefix = fullKey.slice(0, 12) + "...";

    const { data, error } = await supabase.from("api_keys").insert({
      user_id: user.id,
      key_prefix: prefix,
      key_hash: fullKey,
      name: newKeyName,
    }).select().single();

    if (!error && data) {
      setApiKeys(prev => [data, ...prev]);
      setRevealedKey(fullKey);
      setNewKeyName("Default");
    }
  }

  async function toggleKey(keyId: string, currentStatus: boolean) {
    await supabase.from("api_keys").update({ is_active: !currentStatus }).eq("id", keyId);
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, is_active: !currentStatus } : k));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
          <a href="/" className="text-indigo-200 text-sm hover:text-white">Dashboard</a>
          <a href="/developers" className="text-white text-sm font-semibold">Developers</a>
          <a href="/docs" className="text-indigo-200 text-sm hover:text-white">API Docs</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="text-white text-sm bg-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-800">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">Developer Settings</h2>
        <p className="text-gray-500 mb-8">Manage your API keys and integrate PayFlow into your applications.</p>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Generate New API Key</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Key name (e.g. Production)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
            />
            <button onClick={createApiKey} className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">
              🔑 Generate Key
            </button>
          </div>

          {revealedKey && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Copy your API key now — it won&apos;t be shown again!</p>
              <code className="bg-yellow-100 px-3 py-2 rounded text-sm block break-all">{revealedKey}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(revealedKey); alert("Copied!"); }}
                className="mt-2 text-sm text-yellow-700 font-semibold hover:text-yellow-900"
              >
                📋 Copy to clipboard
              </button>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Your API Keys</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Key</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Created</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No API keys yet. Generate your first key above!</td></tr>
              ) : (
                apiKeys.map((k) => (
                  <tr key={k.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm font-semibold">{k.name}</td>
                    <td className="px-4 py-3 text-sm font-mono">{k.key_prefix}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${k.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                        {k.is_active ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(k.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleKey(k.id, k.is_active)}
                        className={`text-sm font-semibold ${k.is_active ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}`}
                      >
                        {k.is_active ? "Revoke" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-3">Quick Start</h3>
          <p className="text-gray-400 text-sm mb-4">Use your API key to create a payment:</p>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto">{`curl -X POST https://payflow-app-pi.vercel.app/api/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2000,
    "currency": "usd",
    "customer": "Jane Doe",
    "description": "Order #1234"
  }'`}</pre>
        </div>
      </div>
    </div>
  );
}