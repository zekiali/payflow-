// PayFlow - Day 2: Transaction History

// Our transaction database (an array that holds objects)
let transactions = [];
let balance = 0;

// Process a payment and store it
function processPayment(amount, customerName) {
    balance = balance + amount;

    let transaction = {
        id: "txn_" + (transactions.length + 1),
        type: "payment",
        amount: amount,
        customer: customerName,
        status: "completed",
        date: new Date().toLocaleString()
    };

    transactions.push(transaction);
    console.log("💰 Payment: $" + amount + " from " + customerName + " (" + transaction.id + ")");
}

// Process a refund and store it
function processRefund(amount, customerName) {
    balance = balance - amount;

    let transaction = {
        id: "txn_" + (transactions.length + 1),
        type: "refund",
        amount: amount,
        customer: customerName,
        status: "completed",
        date: new Date().toLocaleString()
    };

    transactions.push(transaction);
    console.log("🔄 Refund: $" + amount + " to " + customerName + " (" + transaction.id + ")");
}

// Display full dashboard
function showDashboard() {
    console.log("\n========== PayFlow Dashboard ==========");
    console.log("Total Balance: $" + balance.toFixed(2));
    console.log("Total Transactions: " + transactions.length);
    console.log("\n--- Transaction History ---");

    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];
        let symbol = t.type === "payment" ? "+" : "-";
        console.log(t.id + " | " + t.type + " | " + symbol + "$" + t.amount + " | " + t.customer + " | " + t.date);
    }

    console.log("========================================\n");
}

// Simulate a day of business
processPayment(99.99, "Alice");
processPayment(250.00, "Bob");
processPayment(49.99, "Charlie");
processRefund(99.99, "Alice");
processPayment(15.00, "Diana");

// Show the dashboard
showDashboard();