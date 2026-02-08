// PayFlow - Day 4: Classes & Error Handling

class PayFlow {
    constructor(businessName, ownerName) {
        this.businessName = businessName;
        this.ownerName = ownerName;
        this.balance = 0;
        this.transactions = [];
        console.log("✅ " + this.businessName + " account created for " + this.ownerName);
    }

    processPayment(amount, customerName) {
        // Error handling
        if (amount <= 0) {
            console.log("❌ Error: Payment amount must be positive");
            return;
        }
        if (!customerName) {
            console.log("❌ Error: Customer name is required");
            return;
        }

        this.balance = this.balance + amount;
        let transaction = {
            id: "txn_" + (this.transactions.length + 1),
            type: "payment",
            amount: amount,
            customer: customerName,
            status: "completed",
            date: new Date().toLocaleString()
        };
        this.transactions.push(transaction);
        console.log("💰 Payment: $" + amount.toFixed(2) + " from " + customerName + " (" + transaction.id + ")");
        return transaction;
    }

    processRefund(amount, customerName) {
        if (amount <= 0) {
            console.log("❌ Error: Refund amount must be positive");
            return;
        }
        if (amount > this.balance) {
            console.log("❌ Error: Refund of $" + amount.toFixed(2) + " exceeds balance of $" + this.balance.toFixed(2));
            return;
        }

        this.balance = this.balance - amount;
        let transaction = {
            id: "txn_" + (this.transactions.length + 1),
            type: "refund",
            amount: amount,
            customer: customerName,
            status: "completed",
            date: new Date().toLocaleString()
        };
        this.transactions.push(transaction);
        console.log("🔄 Refund: $" + amount.toFixed(2) + " to " + customerName + " (" + transaction.id + ")");
        return transaction;
    }

    findTransaction(id) {
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].id === id) {
                return this.transactions[i];
            }
        }
        console.log("❌ Transaction " + id + " not found");
        return null;
    }

    getCustomerHistory(customerName) {
        let results = [];
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].customer === customerName) {
                results.push(this.transactions[i]);
            }
        }
        return results;
    }

    showDashboard() {
        console.log("\n╔══════════════════════════════════════╗");
        console.log("║        " + this.businessName + " Dashboard        ║");
        console.log("╠══════════════════════════════════════╣");
        console.log("║ Owner: " + this.ownerName);
        console.log("║ Balance: $" + this.balance.toFixed(2));
        console.log("║ Transactions: " + this.transactions.length);
        console.log("╠══════════════════════════════════════╣");
        console.log("║ Transaction History:");

        for (let i = 0; i < this.transactions.length; i++) {
            let t = this.transactions[i];
            let symbol = t.type === "payment" ? "+" : "-";
            console.log("║  " + t.id + " | " + t.type + " | " + symbol + "$" + t.amount.toFixed(2) + " | " + t.customer);
        }

        console.log("╚══════════════════════════════════════╝\n");
    }
}

// === TEST IT OUT ===

// Create a PayFlow account
let myBusiness = new PayFlow("PayFlow", "Zeki");

// Good payments
myBusiness.processPayment(99.99, "Alice");
myBusiness.processPayment(250.00, "Bob");
myBusiness.processPayment(49.99, "Charlie");

// Test error handling
console.log("\n--- Testing Error Handling ---");
myBusiness.processPayment(-50, "Hacker");
myBusiness.processPayment(100, "");
myBusiness.processRefund(9999, "Alice");

// Good refund
myBusiness.processRefund(99.99, "Alice");

// Look up a transaction
console.log("\n--- Lookup ---");
let found = myBusiness.findTransaction("txn_2");
if (found) {
    console.log("Found: " + found.id + " | $" + found.amount + " | " + found.customer);
}
myBusiness.findTransaction("txn_999");

// Show dashboard
myBusiness.showDashboard();

