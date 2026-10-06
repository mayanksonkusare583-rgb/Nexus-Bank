/**
 * history.js
 * Displays and filters transaction history.
 * Supports downloading account statement as a .txt file.
 */

checkLogin();

document.addEventListener("DOMContentLoaded", function() {
    renderHistory("All"); // Initial render with all transactions

    // Add event listener to the dropdown filter
    document.getElementById("filterType").addEventListener("change", function() {
        let filterValue = this.value;
        renderHistory(filterValue);
    });

    // Download Statement button
    document.getElementById("downloadBtn").addEventListener("click", function() {
        downloadStatement();
    });
});

function renderHistory(filterType) {
    let currentUser = getCurrentUser();
    let transactions = currentUser.transactions;
    
    // Create a copy of the transactions array so we can reverse it without modifying the original
    let txList = [...transactions].reverse(); // Newest first

    // Filter using filter() based on selected dropdown value
    let filteredTxs = txList.filter(tx => {
        if (filterType === "All") return true;
        if (filterType === "Deposit") return tx.type === "Deposit" || tx.type.includes("Received");
        if (filterType === "Withdraw") return tx.type === "Withdraw";
        if (filterType === "Transfer") return tx.type.includes("Transfer Sent");
        return true;
    });

    let tbody = document.getElementById("historyBody");
    let noHistoryMsg = document.getElementById("noHistoryMsg");
    let countEl = document.getElementById("transactionCount");

    if (filteredTxs.length === 0) {
        tbody.innerHTML = "";
        noHistoryMsg.style.display = "block";
        countEl.textContent = "";
    } else {
        noHistoryMsg.style.display = "none";
        countEl.textContent = `Showing ${filteredTxs.length} of ${transactions.length} transactions`;
        
        // Map to rows
        let html = filteredTxs.map((tx, index) => {
            let typeColor = "";
            if (tx.type === "Deposit" || tx.type.includes("Received")) typeColor = "color: #059669; font-weight: 600;";
            else if (tx.type === "Withdraw" || tx.type.includes("Sent")) typeColor = "color: #dc2626; font-weight: 600;";

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${tx.date}</td>
                    <td style="${typeColor}">${tx.type}</td>
                    <td>${formatMoney(tx.amount)}</td>
                    <td>${formatMoney(tx.balanceAfter)}</td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = html;
    }
}

/**
 * Downloads the account statement as a plain text (.txt) file.
 * Uses Blob and URL.createObjectURL to generate a downloadable file.
 */
function downloadStatement() {
    let currentUser = getCurrentUser();
    let transactions = currentUser.transactions;

    if (transactions.length === 0) {
        alert("No transactions to download.");
        return;
    }

    // Build the statement string
    let separator = "=".repeat(70);
    let statement = "";
    statement += separator + "\n";
    statement += "                  NEXUS BANK - ACCOUNT STATEMENT\n";
    statement += separator + "\n\n";
    statement += `Account Holder : ${currentUser.name}\n`;
    statement += `Account Number : ${currentUser.accountNumber}\n`;
    statement += `Account Type   : ${currentUser.accountType}\n`;
    statement += `Current Balance: ${formatMoney(currentUser.balance)}\n`;
    statement += `Statement Date : ${getCurrentDateTime()}\n\n`;
    statement += separator + "\n";
    statement += padRight("S.No", 6) + padRight("Date & Time", 25) + padRight("Type", 30) + padRight("Amount", 15) + "Balance\n";
    statement += separator + "\n";

    // Use forEach to iterate over transactions (newest first)
    let reversed = [...transactions].reverse();
    reversed.forEach((tx, index) => {
        statement += padRight((index + 1).toString(), 6);
        statement += padRight(tx.date, 25);
        statement += padRight(tx.type, 30);
        statement += padRight(formatMoney(tx.amount), 15);
        statement += formatMoney(tx.balanceAfter) + "\n";
    });

    statement += separator + "\n";
    statement += `\nTotal Transactions: ${transactions.length}\n`;
    statement += "\nThis is a computer-generated statement and does not require a signature.\n";
    statement += "© 2026 Nexus Bank - YCCE, Nagpur\n";

    // Create downloadable blob using Blob constructor
    let blob = new Blob([statement], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    // Create a temporary link element and trigger the download
    let link = document.createElement("a");
    link.href = url;
    link.download = `NexusBank_Statement_${currentUser.accountNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(url);
}

/**
 * Helper: Pad string to the right with spaces for alignment in text statement.
 */
function padRight(str, length) {
    str = String(str);
    while (str.length < length) {
        str += " ";
    }
    return str;
}
