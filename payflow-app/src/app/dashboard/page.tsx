"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

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
  const [activeTab, setActiveTab] = useState<"overview" | "transactions">("overview");
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
    if (!error && data) setTransactions(data);
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
      user_id: user.id, type: "payment", amount: amt, customer: customerName,
    }).select().single();
    if (!error && data) {
      setTransactions(prev => [data, ...prev]);
      setCustomerName(""); setAmount("");
    }
  }

  async function makeRefund() {
    if (!customerName) { alert("Enter a customer name"); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { alert("Enter a valid amount"); return; }
    if (amt > balance) { alert("Refund exceeds balance!"); return; }
    const { data, error } = await supabase.from("transactions").insert({
      user_id: user.id, type: "refund", amount: amt, customer: customerName,
    }).select().single();
    if (!error && data) {
      setTransactions(prev => [data, ...prev]);
      setCustomerName(""); setAmount("");
    }
  }

  const balance = transactions.reduce((sum, t) => {
    return t.type === "payment" ? sum + Number(t.amount) : sum - Number(t.amount);
  }, 0);

  const refundTotal = transactions.filter(t => t.type === "refund").reduce((sum, t) => sum + Number(t.amount), 0);
  const paymentTotal = transactions.filter(t => t.type === "payment").reduce((sum, t) => sum + Number(t.amount), 0);

  // Chart data: group transactions by date
  const chartData = transactions.reduce((acc: any[], t) => {
    const date = new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = acc.find(d => d.date === date);
    if (existing) {
      if (t.type === "payment") existing.payments += Number(t.amount);
      else existing.refunds += Number(t.amount);
    } else {
      acc.push({
        date,
        payments: t.type === "payment" ? Number(t.amount) : 0,
        refunds: t.type === "refund" ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, []).reverse();

  // Cumulative revenue chart
  const cumulativeData = chartData.reduce((acc: any[], d, i) => {
    const prev = i > 0 ? acc[i - 1].revenue : 0;
    acc.push({ date: d.date, revenue: prev + d.payments - d.refunds });
    return acc;
  }, []);

  // Top customers
  const topCustomers = transactions
    .filter(t => t.type === "payment")
    .reduce((acc: any, t) => {
      acc[t.customer] = (acc[t.customer] || 0) + Number(t.amount);
      return acc;
    }, {});
  const topCustomerList = Object.entries(topCustomers)
    .map(([name, total]) => ({ name, total: total as number }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
          <a href="/dashboard" className="text-white text-sm font-semibold">Dashboard</a>
          <a href="/customers" className="text-indigo-200 text-sm hover:text-white">Customers</a>
          <a href="/developers" className="text-indigo-200 text-sm hover:text-white">Developers</a>
          <a href="/docs" className="text-indigo-200 text-sm hover:text-white">API Docs</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="text-white text-sm bg-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-800">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Balance</p>
            <p className="text-2xl font-semibold text-green-500">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Revenue</p>
            <p className="text-2xl font-semibold text-indigo-600">${paymentTotal.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Transactions</p>
            <p className="text-2xl font-semibold text-gray-800">{transactions.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Refunds</p>
            <p className="text-2xl font-semibold text-red-500">${refundTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Payments vs Refunds</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="payments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="refunds" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Cumulative Revenue</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers + New Transaction */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Customers</h3>
            {topCustomerList.length === 0 ? (
              <p className="text-gray-400 text-sm">No customers yet.</p>
            ) : (
              topCustomerList.map((c, i) => (
                <div key={c.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-500">${c.total.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">New Transaction</h3>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500" />
              <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500" />
              <div className="flex gap-3">
                <button onClick={makePayment} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">💰 Payment</button>
                <button onClick={makeRefund} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600">🔄 Refund</button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Transaction History</h3>
          </div>
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
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono">{t.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === "payment" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{t.type}</span></td>
                    <td className="px-4 py-3 text-sm">{t.customer}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{t.type === "payment" ? "+" : "-"}${Number(t.amount).toFixed(2)}</td>
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