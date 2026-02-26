"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ transactions: 0, customers: 0, apiKeys: 0 });
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        loadStats(data.user.id);
      }
    });
  }, [router]);

  async function loadStats(userId: string) {
    const { data: txns } = await supabase.from("transactions").select("*").eq("user_id", userId);
    const { data: keys } = await supabase.from("api_keys").select("*").eq("user_id", userId);

    const customerSet = new Set((txns || []).map((t: any) => t.customer));

    setStats({
      transactions: txns?.length || 0,
      customers: customerSet.size,
      apiKeys: keys?.length || 0,
    });
    setLoading(false);
  }

  async function updatePassword() {
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage("Error updating password: " + error.message);
    } else {
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function deleteAllData() {
    if (!confirm("Are you sure? This will delete ALL your transactions, customers, and API keys. This cannot be undone.")) return;
    if (!confirm("FINAL WARNING: This action is permanent. Continue?")) return;

    await supabase.from("transactions").delete().eq("user_id", user.id);
    await supabase.from("api_keys").delete().eq("user_id", user.id);
    setMessage("All data has been deleted.");
    loadStats(user.id);
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const createdDate = new Date(user?.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
          <a href="/dashboard" className="text-indigo-200 text-sm hover:text-white">Dashboard</a>
          <a href="/customers" className="text-indigo-200 text-sm hover:text-white">Customers</a>
          <a href="/developers" className="text-indigo-200 text-sm hover:text-white">Developers</a>
          <a href="/docs" className="text-indigo-200 text-sm hover:text-white">API Docs</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="text-white text-sm bg-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-800">Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-gray-500 mb-8">Manage your account, security, and data.</p>

        {message && (
          <div className={`mb-6 p-4 rounded-md text-sm font-semibold ${message.includes("Error") || message.includes("must") || message.includes("match") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {message}
          </div>
        )}

        {/* Profile */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4">Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.email}</p>
              <p className="text-gray-400 text-sm">Member since {createdDate}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats.transactions}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Transactions</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats.customers}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Customers</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats.apiKeys}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">API Keys</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4">Security</h3>
          <p className="text-gray-500 text-sm mb-4">Update your password to keep your account secure.</p>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
            />
            <button onClick={updatePassword} className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 w-fit">
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-red-100">
          <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-gray-500 text-sm mb-4">Permanently delete all your transactions, API keys, and customer data. This action cannot be undone.</p>
          <button onClick={deleteAllData} className="bg-red-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-600">
            🗑️ Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}