"use client";
import { useState } from "react";

type Transaction = {
  id: string;
  type: "payment" | "refund";
  amount: number;
  customer: string;
  date: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [refundTotal, setRefundTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");

  function makePayment() {
    if (!customerName) { alert("Enter a customer name"); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { alert("Enter a valid amount"); return; }

    setBalance(prev => prev + amt);
    setTransactions(prev => [...prev, {
      id: "txn_" + (prev.length + 1),
      type: "payment",
      amount: amt,
      customer: customerName,
      date: new Date().toLocaleString()
    }]);
    setCustomerName("");
    setAmount("");
  }

  function makeRefund() {
    if (!customerName) { alert("Enter a customer name"); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { alert("Enter a valid amount"); return; }
    if (amt > balance) { alert("Refund exceeds balance!"); return; }

    setBalance(prev => prev - amt);
    setRefundTotal(prev => prev + amt);
    setTransactions(prev => [...prev, {
      id: "txn_" + (prev.length + 1),
      type: "refund",
      amount: amt,
      customer: customerName,
      date: new Date().toLocaleString()
    }]);
    setCustomerName("");
    setAmount("");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
        <span className="text-indigo-200 text-sm">Dashboard</span>
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
            <input
              type="text"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={makePayment} className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">
              💰 Process Payment
            </button>
            <button onClick={makeRefund} className="bg-red-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-600">
              🔄 Process Refund
            </button>
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
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No transactions yet. Process your first payment above!
                  </td>
                </tr>
              ) : (
                [...transactions].reverse().map((t) => (
                  <tr key={t.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm">{t.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.type === "payment" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{t.customer}</td>
                    <td className="px-4 py-3 text-sm">
                      {t.type === "payment" ? "+" : "-"}${t.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.date}</td>
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
