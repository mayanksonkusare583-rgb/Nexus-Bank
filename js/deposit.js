/**
 * deposit.js
 * Handles money deposit functionality.
 */

checkLogin();

document.addEventListener("DOMContentLoaded", function() {
    let currentUser = getCurrentUser();
    document.getElementById("displayBalance").textContent = formatMoney(currentUser.balance);
});

document.getElementById("depositForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let amountInput = document.getElementById("amount").value;
    let amount = parseFloat(amountInput);
    
    let errorDiv = document.getElementById("amountError");
    let successDiv = document.getElementById("successMsg");
    
    errorDiv.style.display = "none";
    successDiv.style.display = "none";

    // Validation
    if (isNaN(amount) || amount <= 0) {
        errorDiv.textContent = "Please enter a valid positive amount.";
        errorDiv.style.display = "block";
        return;
    }

    if (amount > 100000) {
        errorDiv.textContent = "Maximum deposit limit per transaction is ₹ 100,000.";
        errorDiv.style.display = "block";
        return;
    }

    // Process Deposit
    let users = getUsers();
    let loggedInAcc = getLoggedInUser();
    
    // Find the user index to update
    let userIndex = users.findIndex(u => u.accountNumber === loggedInAcc);
    
    if (userIndex !== -1) {
        let user = users[userIndex];
        
        // Update balance
        user.balance += amount;
        
        // Add transaction record
        user.transactions.push({
            date: getCurrentDateTime(),
            type: "Deposit",
            amount: amount,
            balanceAfter: user.balance
        });
        
        // Save back to storage
        users[userIndex] = user;
        saveUsers(users);
        
        // Update UI
        document.getElementById("displayBalance").textContent = formatMoney(user.balance);
        document.getElementById("amount").value = "";
        
        successDiv.textContent = `₹ ${amount} deposited successfully. New balance: ${formatMoney(user.balance)}`;
        successDiv.style.display = "block";
    }
});
