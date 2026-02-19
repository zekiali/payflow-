"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

type Customer = {
  name: string;
  totalPaid: number;
  totalRefunded: number;
  transactionCount: number;
  lastTransaction: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        loadCustomers(data.user.id);
      }
    });
  }, [router]);

  async function loadCustomers(userId: string) {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      const customerMap: { [key: string]: Customer } = {};
      data.forEach((t: any) => {
        if (!customerMap[t.customer]) {
          customerMap[t.customer] = {
            name: t.customer,
            totalPaid: 0,
            totalRefunded: 0,
            transactionCount: 0,
            lastTransaction: t.created_at,
          };
        }
        customerMap[t.customer].transactionCount++;
        if (t.type === "payment") {
          customerMap[t.customer].totalPaid += Number(t.amount);
        } else {
          customerMap[t.customer].totalRefunded += Number(t.amount);
        }
      });
      const sorted = Object.values(customerMap).sort((a, b) => b.totalPaid - a.totalPaid);
      setCustomers(sorted);
    }
    setLoading(false);
  }

  async function viewCustomerDetails(name: string) {
    setSelectedCustomer(name);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("customer", name)
      .order("created_at", { ascending: false });
    if (data) setCustomerTransactions(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPaid, 0);
  const avgRevenue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
          <a href="/dashboard" className="text-indigo-200 text-sm hover:text-white">Dashboard</a>
          <a href="/customers" className="text-white text-sm font-semibold">Customers</a>
          <a href="/developers" className="text-indigo-200 text-sm hover:text-white">Developers</a>
          <a href="/docs" className="text-indigo-200 text-sm hover:text-white">API Docs</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="text-white text-sm bg-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-800">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">Customers</h2>
        <p className="text-gray-500 mb-8">View and manage all customers who have transacted through PayFlow.</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Customers</p>
            <p className="text-2xl font-semibold text-indigo-600">{totalCustomers}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Revenue</p>
            <p className="text-2xl font-semibold text-green-500">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Avg Revenue / Customer</p>
            <p className="text-2xl font-semibold text-gray-800">${avgRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Paid</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Refunded</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Net</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Txns</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No customers found.</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.name} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedCustomer === c.name ? "bg-indigo-50" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-green-500 font-semibold">${c.totalPaid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-red-500 font-semibold">${c.totalRefunded.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">${(c.totalPaid - c.totalRefunded).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.transactionCount}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewCustomerDetails(c.name)}
                          className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Customer Detail Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {selectedCustomer ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold">
                    {selectedCustomer.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedCustomer}</h3>
                    <p className="text-gray-400 text-xs">{customerTransactions.length} transactions</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Paid</span>
                    <span className="text-sm font-semibold text-green-500">
                      ${customerTransactions.filter(t => t.type === "payment").reduce((s: number, t: any) => s + Number(t.amount), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Refunded</span>
                    <span className="text-sm font-semibold text-red-500">
                      ${customerTransactions.filter(t => t.type === "refund").reduce((s: number, t: any) => s + Number(t.amount), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-semibold">Net Revenue</span>
                    <span className="text-sm font-bold">
                      ${customerTransactions.reduce((s: number, t: any) => t.type === "payment" ? s + Number(t.amount) : s - Number(t.amount), 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {customerTransactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.type === "payment" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                          {t.type}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">{t.type === "payment" ? "+" : "-"}${Number(t.amount).toFixed(2)}</span>
                      <span className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">👤</p>
                <p className="text-gray-400 text-sm">Select a customer to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


