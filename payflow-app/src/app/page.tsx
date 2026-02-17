"use client";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-600">💳 PayFlow</h1>
        <div className="flex items-center gap-6">
          <a href="/docs" className="text-gray-600 text-sm hover:text-gray-900">Documentation</a>
          <a href="#pricing" className="text-gray-600 text-sm hover:text-gray-900">Pricing</a>
          <button onClick={() => router.push("/login")} className="text-sm text-indigo-600 font-semibold hover:text-indigo-800">Sign In</button>
          <button onClick={() => router.push("/login")} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md font-semibold hover:bg-indigo-700">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-6">NEW — PayFlow API v1 is live</div>
        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Payment infrastructure<br />for the internet</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">Accept payments, manage transactions, and grow your revenue with PayFlow&apos;s powerful API. Built for developers, designed for scale.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push("/login")} className="bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-indigo-700">Start Building →</button>
          <button onClick={() => router.push("/docs")} className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-50">Read the Docs</button>
        </div>
      </div>

      {/* Code Preview */}
      <div className="max-w-3xl mx-auto px-8 mb-20">
        <div className="bg-gray-900 rounded-xl p-6 shadow-2xl">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code>
              <span className="text-gray-500">{"// Create a payment with one API call\n"}</span>
              <span className="text-purple-400">{"const "}</span>
              <span className="text-blue-300">{"response "}</span>
              <span className="text-white">{"= "}</span>
              <span className="text-purple-400">{"await "}</span>
              <span className="text-yellow-300">{"fetch"}</span>
              <span className="text-white">{"("}</span>
              <span className="text-green-400">{'"https://payflow-app-pi.vercel.app/api/payments"'}</span>
              <span className="text-white">{", {\n"}</span>
              <span className="text-white">{"  method: "}</span>
              <span className="text-green-400">{'"POST"'}</span>
              <span className="text-white">{",\n"}</span>
              <span className="text-white">{"  headers: {\n"}</span>
              <span className="text-white">{"    "}</span>
              <span className="text-green-400">{'"Authorization"'}</span>
              <span className="text-white">{": "}</span>
              <span className="text-green-400">{'"Bearer pk_live_your_api_key"'}</span>
              <span className="text-white">{",\n"}</span>
              <span className="text-white">{"    "}</span>
              <span className="text-green-400">{'"Content-Type"'}</span>
              <span className="text-white">{": "}</span>
              <span className="text-green-400">{'"application/json"'}</span>
              <span className="text-white">{"\n  },\n"}</span>
              <span className="text-white">{"  body: JSON.stringify({\n"}</span>
              <span className="text-white">{"    amount: "}</span>
              <span className="text-orange-400">{"5000"}</span>
              <span className="text-white">{",\n"}</span>
              <span className="text-white">{"    currency: "}</span>
              <span className="text-green-400">{'"usd"'}</span>
              <span className="text-white">{",\n"}</span>
              <span className="text-white">{"    customer: "}</span>
              <span className="text-green-400">{'"Jane Doe"'}</span>
              <span className="text-white">{"\n  })\n"}</span>
              <span className="text-white">{"});"}</span>
            </code>
          </pre>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h3 className="text-3xl font-bold text-center mb-4">Everything you need to accept payments</h3>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">A complete toolkit for building payment flows, managing transactions, and scaling your business.</p>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="font-bold text-lg mb-2">Simple API</h4>
              <p className="text-gray-500 text-sm">Accept payments with a single API call. Clean RESTful endpoints with comprehensive documentation.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🔒</div>
              <h4 className="font-bold text-lg mb-2">Secure by Default</h4>
              <p className="text-gray-500 text-sm">API key authentication, row-level security, and encrypted data storage keep your transactions safe.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="font-bold text-lg mb-2">Real-time Analytics</h4>
              <p className="text-gray-500 text-sm">Track revenue, monitor transactions, and analyze customer behavior with our built-in dashboard.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🔑</div>
              <h4 className="font-bold text-lg mb-2">API Key Management</h4>
              <p className="text-gray-500 text-sm">Generate, rotate, and revoke API keys from your developer dashboard with full control.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">💰</div>
              <h4 className="font-bold text-lg mb-2">Payments &amp; Refunds</h4>
              <p className="text-gray-500 text-sm">Process payments and issue refunds programmatically. Full transaction history at your fingertips.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🚀</div>
              <h4 className="font-bold text-lg mb-2">Built for Scale</h4>
              <p className="text-gray-500 text-sm">Powered by Supabase and Vercel. Your payment infrastructure scales automatically with your business.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-20 max-w-6xl mx-auto px-8">
        <h3 className="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h3>
        <p className="text-gray-500 text-center mb-12">Start free, scale as you grow.</p>
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="border border-gray-200 rounded-xl p-8">
            <h4 className="font-bold text-lg mb-1">Starter</h4>
            <p className="text-gray-400 text-sm mb-4">For side projects</p>
            <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400 font-normal">/mo</span></p>
            <div className="text-sm text-gray-600 space-y-3 mb-8">
              <p>✓ 100 transactions/mo</p>
              <p>✓ 1 API key</p>
              <p>✓ Basic dashboard</p>
              <p>✓ Email support</p>
            </div>
            <button onClick={() => router.push("/login")} className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md font-semibold hover:bg-indigo-50">Get Started</button>
          </div>
          <div className="border-2 border-indigo-600 rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-semibold">POPULAR</div>
            <h4 className="font-bold text-lg mb-1">Pro</h4>
            <p className="text-gray-400 text-sm mb-4">For growing businesses</p>
            <p className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400 font-normal">/mo</span></p>
            <div className="text-sm text-gray-600 space-y-3 mb-8">
              <p>✓ 10,000 transactions/mo</p>
              <p>✓ Unlimited API keys</p>
              <p>✓ Advanced analytics</p>
              <p>✓ Priority support</p>
            </div>
            <button onClick={() => router.push("/login")} className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700">Get Started</button>
          </div>
          <div className="border border-gray-200 rounded-xl p-8">
            <h4 className="font-bold text-lg mb-1">Enterprise</h4>
            <p className="text-gray-400 text-sm mb-4">For large organizations</p>
            <p className="text-4xl font-bold mb-6">Custom</p>
            <div className="text-sm text-gray-600 space-y-3 mb-8">
              <p>✓ Unlimited transactions</p>
              <p>✓ Unlimited API keys</p>
              <p>✓ Custom integrations</p>
              <p>✓ Dedicated support</p>
            </div>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-50">Contact Sales</button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-2xl mx-auto text-center px-8">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to start building?</h3>
          <p className="text-indigo-200 mb-8">Join thousands of developers using PayFlow to power their payments.</p>
          <button onClick={() => router.push("/login")} className="bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-100">Create Free Account →</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <p className="text-gray-400 text-sm">© 2026 PayFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/docs" className="text-gray-400 text-sm hover:text-gray-600">Documentation</a>
            <a href="/developers" className="text-gray-400 text-sm hover:text-gray-600">Developers</a>
            <a href="/login" className="text-gray-400 text-sm hover:text-gray-600">Sign In</a>
          </div>
        </div>
      </footer>
    </div>
  );
}