"use client";

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-xl font-bold">💳 PayFlow</h1>
          <a href="/dashboard" className="text-indigo-200 text-sm hover:text-white">Dashboard</a>
          <a href="/developers" className="text-indigo-200 text-sm hover:text-white">Developers</a>
          <a href="/docs" className="text-white text-sm font-semibold">API Docs</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-2">PayFlow API Documentation</h2>
        <p className="text-gray-500 mb-8">Everything you need to integrate PayFlow into your application.</p>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-3">Authentication</h3>
          <p className="text-gray-600 mb-4">All API requests require a valid API key. Include your key in the Authorization header:</p>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto mb-4">
{`Authorization: Bearer pk_live_your_api_key_here`}
          </pre>
          <p className="text-gray-500 text-sm">Get your API key from the <a href="/developers" className="text-indigo-600 font-semibold">Developer Settings</a> page.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-1">Base URL</h3>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto mt-3">
{`https://payflow-app-pi.vercel.app/api`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
            <h3 className="text-xl font-bold">/api/payments</h3>
          </div>
          <p className="text-gray-600 mb-4">Create a new payment. Amounts are in cents (e.g. 5000 = $50.00).</p>

          <h4 className="font-semibold mb-2">Request Body</h4>
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Parameter</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Required</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">amount</td>
                  <td className="py-2">integer</td>
                  <td className="py-2">Yes</td>
                  <td className="py-2">Amount in cents</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">currency</td>
                  <td className="py-2">string</td>
                  <td className="py-2">No</td>
                  <td className="py-2">Three-letter currency code (default: usd)</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">customer</td>
                  <td className="py-2">string</td>
                  <td className="py-2">Yes</td>
                  <td className="py-2">Customer name</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">description</td>
                  <td className="py-2">string</td>
                  <td className="py-2">No</td>
                  <td className="py-2">Payment description</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">Example Request</h4>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto mb-4">
{`curl -X POST https://payflow-app-pi.vercel.app/api/payments \\
  -H "Authorization: Bearer pk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "usd",
    "customer": "Jane Doe",
    "description": "Order #1234"
  }'`}
          </pre>

          <h4 className="font-semibold mb-2">Example Response</h4>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "3d96ae30-29bd-48aa-8e2c-beb533d0c7fc",
  "object": "payment",
  "amount": 5000,
  "currency": "usd",
  "customer": "Jane Doe",
  "description": "Order #1234",
  "status": "succeeded",
  "created": "2026-02-14T02:40:09.467Z"
}`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
            <h3 className="text-xl font-bold">/api/payments</h3>
          </div>
          <p className="text-gray-600 mb-4">List all payments for your account. Returns the 20 most recent payments.</p>

          <h4 className="font-semibold mb-2">Example Request</h4>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto mb-4">
{`curl https://payflow-app-pi.vercel.app/api/payments \\
  -H "Authorization: Bearer pk_live_your_api_key"`}
          </pre>

          <h4 className="font-semibold mb-2">Example Response</h4>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-blue-400 overflow-x-auto">
{`{
  "object": "list",
  "data": [
    {
      "id": "3d96ae30-...",
      "object": "payment",
      "amount": 5000,
      "currency": "usd",
      "customer": "Jane Doe",
      "type": "payment",
      "status": "succeeded",
      "created": "2026-02-14T02:40:09.467Z"
    }
  ],
  "has_more": false
}`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
            <h3 className="text-xl font-bold">/api/refunds</h3>
          </div>
          <p className="text-gray-600 mb-4">Create a refund. Validates that the refund amount does not exceed your available balance.</p>

          <h4 className="font-semibold mb-2">Request Body</h4>
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Parameter</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Required</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">amount</td>
                  <td className="py-2">integer</td>
                  <td className="py-2">Yes</td>
                  <td className="py-2">Refund amount in cents</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">customer</td>
                  <td className="py-2">string</td>
                  <td className="py-2">Yes</td>
                  <td className="py-2">Customer name</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">reason</td>
                  <td className="py-2">string</td>
                  <td className="py-2">No</td>
                  <td className="py-2">Reason for refund</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">Example Request</h4>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto mb-4">
{`curl -X POST https://payflow-app-pi.vercel.app/api/refunds \\
  -H "Authorization: Bearer pk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "customer": "Jane Doe",
    "reason": "Product returned"
  }'`}
          </pre>

          <h4 className="font-semibold mb-2">Example Response</h4>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "a1b2c3d4-...",
  "object": "refund",
  "amount": 1000,
  "currency": "usd",
  "customer": "Jane Doe",
  "reason": "Product returned",
  "status": "succeeded",
  "created": "2026-02-17T..."
}`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
            <h3 className="text-xl font-bold">/api/refunds</h3>
          </div>
          <p className="text-gray-600 mb-4">List all refunds for your account.</p>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-green-400 overflow-x-auto">
{`curl https://payflow-app-pi.vercel.app/api/refunds \\
  -H "Authorization: Bearer pk_live_your_api_key"`}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-3">Error Handling</h3>
          <p className="text-gray-600 mb-4">PayFlow uses standard HTTP status codes. Errors return a JSON object with details:</p>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-red-400 overflow-x-auto mb-4">
{`{
  "error": {
    "message": "Invalid or missing API key",
    "type": "authentication_error"
  }
}`}
          </pre>
          <div className="bg-gray-50 rounded-md p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Status Code</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">401</td>
                  <td className="py-2">authentication_error</td>
                  <td className="py-2">Invalid or missing API key</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">400</td>
                  <td className="py-2">invalid_request</td>
                  <td className="py-2">Missing or invalid parameters</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-mono">500</td>
                  <td className="py-2">api_error</td>
                  <td className="py-2">Server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}