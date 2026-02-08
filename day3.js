// PayFlow - Day 3: Search & Lookup

let transactions = [];
let balance = 0;

function processPayment(amount, customerName) {
    balance = balance + amount;
    transactions.push({
        id: "txn_" + (transactions.length + 1),
        type: "payment",
        amount: amount,
        customer: customerName,
        status: "completed",
        date: new Date().toLocaleString()
    });
}

function processRefund(amount, customerName) {
    balance = balance - amount;
    transactions.push({
        id: "txn_" + (transactions.length + 1),
        type: "refund",
        amount: amount,
        customer: customerName,
        status: "completed",
        date: new Date().toLocaleString()
    });
}

// NEW: Find a transaction by ID
function findTransaction(id) {
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id === id) {
            return transactions[i];
        }
    }
    return null;
}

// NEW: Get all transactions for a customer
function getCustomerHistory(customerName) {
    let results = [];
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].customer === customerName) {
            results.push(transactions[i]);
        }
    }
    return results;
}

// NEW: Get total revenue
function getTotalRevenue() {
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type === "payment") {
            total = total + transactions[i].amount;
        }
    }
    return total;
}

// NEW: Get total refunds
function getTotalRefunds() {
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type === "refund") {
            total = total + transactions[i].amount;
        }
    }
    return total;
}

// Simulate business
processPayment(99.99, "Alice");
processPayment(250.00, "Bob");
processPayment(49.99, "Alice");
processRefund(99.99, "Alice");
processPayment(75.00, "Charlie");
processPayment(120.00, "Bob");

// Test: Look up a transaction
console.log("=== Find Transaction ===");
let found = findTransaction("txn_3");
if (found) {
    console.log("Found: " + found.id + " | " + found.type + " | $" + found.amount + " | " + found.customer);
} else {
    console.log("Transaction not found");
}

// Test: Customer history
console.log("\n=== Alice's History ===");
let aliceHistory = getCustomerHistory("Alice");
for (let i = 0; i < aliceHistory.length; i++) {
    let t = aliceHistory[i];
    console.log(t.id + " | " + t.type + " | $" + t.amount);
}

// Test: Revenue report
console.log("\n=== Revenue Report ===");
console.log("Total Revenue: $" + getTotalRevenue().toFixed(2));
console.log("Total Refunds: $" + getTotalRefunds().toFixed(2));
console.log("Net Balance: $" + balance.toFixed(2));
console.log("Total Transactions: " + transactions.length);