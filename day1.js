let businessName = "PayFlow";
let ownerName = "Zeki";
let accountBalance = 0;
let transactionCount = 0;
let isVerified = false;

console.log("==" + businessName + " Dashboard ===");
console.log("Owner: " + ownerName);
console.log("Account Balance: $" + accountBalance);
console.log("Transactions: " + transactionCount);
console.log("Verified: " + isVerified);

// Function: process a payment
function processPayment(amount, customerName) {
    accountBalance = accountBalance + amount;
    transactionCount = transactionCount + 1;
    console.log("\n💰 Payment received: $" + amount + " from " + customerName);
    console.log("New balance: $" + accountBalance);
    console.log("Total transactions: " + transactionCount);
}

// Simulate some payments
processPayment(49.99, "Alice");
processPayment(120.00, "Bob");
processPayment(9.99, "Charlie");

// Final summary
console.log("\n=== End of Day Summary ===");
console.log("Total earned: $" + accountBalance);
console.log("Total transactions: " + transactionCount);

// Refund function
function processRefund(amount, customerName) {
    accountBalance = accountBalance - amount;
    transactionCount = transactionCount + 1;
    console.log("\n🔄 Refund issued: $" + amount + " to " + customerName);
    console.log("New balance: $" + accountBalance);
    console.log("Total transactions: " + transactionCount);
}

// Test refund
processRefund(49.99, "Alice");

// Final balance after refund
console.log("\n=== After Refund ===");
console.log("Final balance: $" + accountBalance);