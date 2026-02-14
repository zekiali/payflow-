"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

type Transaction = {
  id: string;
  type: "payment" | "refund";
  amount: number;
  customer: string;
  created_at: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        loadTransactions(data.user.id);
      }
    });
  }, [router]);

  async function loadTransactions(userId: string) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function makePayment() {
    if (!customerName) { alert("Enter a customer name"); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { alert("Enter a valid amount"); return; }

    const { data, error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "payment",
      amount: amt,
      customer: customerName,
    }).select().single();

    if (!error && data) {
      setTransactions(prev => [data, ...prev]);
      setCustomerName("");
      setAmount("");
    } else {
      alert("Error saving transaction");
    }
  }

  async function makeRefund() {
    if (!customerName) { alert("Enter a customer name"); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { alert("Enter a valid amount"); return; }
    if (amt > balance) { alert("Refund exceeds balance!"); return; }

    const { data, error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "refund",
      amount: amt,
      customer: customerName,
    }).select().single();

    if (!error && data) {
      setTransactions(prev => [data, ...prev]);
      setCustomerName("");
      setAmount("");
    } else {
      alert("Error saving transaction");
    }
  }

  const balance = transactions.reduce((sum, t) => {
    return t.type === "payment" ? sum + Number(t.amount) : sum - Number(t.amount);
  }, 0);

  const refundTotal = transactions
    .filter(t => t.type === "refund")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
          <a href="/" className="text-white text-sm font-semibold">Dashboard</a>
          <a href="/developers" className="text-indigo-200 text-sm hover:text-white">Developers</a>
          <a href="/docs" className="text-indigo-200 text-sm hover:text-white">API Docs</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="text-white text-sm bg-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-800">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Balance</p>
            <p className="text-2xl font-semibold text-green-500">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Transactions</p>
            <p className="text-2xl font-semibold text-indigo-600">{transactions.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Refunds</p>
            <p className="text-2xl font-semibold text-red-500">${refundTotal.toFixed(2)}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex gap-3 mb-3">
            <input type="text" placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500" />
            <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={makePayment} className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">💰 Process Payment</button>
            <button onClick={makeRefund} className="bg-red-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-600">🔄 Process Refund</button>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No transactions yet. Process your first payment above!</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm font-mono">{t.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === "payment" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{t.type}</span></td>
                    <td className="px-4 py-3 text-sm">{t.customer}</td>
                    <td className="px-4 py-3 text-sm">{t.type === "payment" ? "+" : "-"}${Number(t.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}