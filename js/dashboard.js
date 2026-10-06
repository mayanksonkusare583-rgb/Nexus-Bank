/**
 * dashboard.js
 * Loads user data and recent transactions.
 */

// Ensure user is logged in
checkLogin();

document.addEventListener("DOMContentLoaded", function() {
    let currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Fallback in case of data corruption
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
        return;
    }

    // Populate user info
    document.getElementById("customerName").textContent = currentUser.name;
    document.getElementById("accountNumber").textContent = currentUser.accountNumber;
    document.getElementById("accountType").textContent = currentUser.accountType;
    document.getElementById("currentBalance").textContent = formatMoney(currentUser.balance);

    // Populate recent transactions (last 3)
    let transactions = currentUser.transactions;
    let tbody = document.getElementById("recentTransactionsBody");
    let noTransMsg = document.getElementById("noTransactionsMsg");

    if (transactions.length === 0) {
        noTransMsg.style.display = "block";
    } else {
        noTransMsg.style.display = "none";
        
        // Get last 3 transactions (reverse the array to get newest first, then slice)
        // Or slice last 3, then reverse.
        let recentTxs = transactions.slice(-3).reverse();
        
        // Use map to create HTML rows
        let rowsHtml = recentTxs.map(tx => {
            // Color code the type
            let typeColor = "";
            if (tx.type === "Deposit" || tx.type.includes("Received")) typeColor = "color: green;";
            else if (tx.type === "Withdraw" || tx.type.includes("Sent")) typeColor = "color: red;";
            
            return `
                <tr>
                    <td>${tx.date}</td>
                    <td style="${typeColor}">${tx.type}</td>
                    <td>${formatMoney(tx.amount)}</td>
                    <td>${formatMoney(tx.balanceAfter)}</td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rowsHtml;
    }

    // Calculate total deposits and withdrawals using reduce()
    let totalDep = transactions.reduce((total, tx) => {
        if (tx.type === "Deposit" || tx.type.includes("Received")) {
            return total + tx.amount;
        }
        return total;
    }, 0);

    let totalWith = transactions.reduce((total, tx) => {
        if (tx.type === "Withdraw" || tx.type.includes("Sent")) {
            return total + tx.amount;
        }
        return total;
    }, 0);

    document.getElementById("totalDeposits").textContent = formatMoney(totalDep);
    document.getElementById("totalWithdrawals").textContent = formatMoney(totalWith);
});
