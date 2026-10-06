/**
 * withdraw.js
 * Handles money withdrawal functionality with confirmation dialog.
 */

checkLogin();

document.addEventListener("DOMContentLoaded", function() {
    let currentUser = getCurrentUser();
    document.getElementById("displayBalance").textContent = formatMoney(currentUser.balance);
});

document.getElementById("withdrawForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let amountInput = document.getElementById("amount").value;
    let amount = parseFloat(amountInput);
    
    let errorDiv = document.getElementById("amountError");
    let successDiv = document.getElementById("successMsg");
    
    errorDiv.style.display = "none";
    successDiv.style.display = "none";

    let currentUser = getCurrentUser();

    // Validation
    if (isNaN(amount) || amount <= 0) {
        errorDiv.textContent = "Please enter a valid positive amount.";
        errorDiv.style.display = "block";
        return;
    }

    if (amount > currentUser.balance) {
        errorDiv.textContent = "Insufficient balance!";
        errorDiv.style.display = "block";
        return;
    }

    // Confirm before processing using confirm()
    let confirmed = confirm(`Are you sure you want to withdraw ${formatMoney(amount)}?\n\nRemaining balance will be: ${formatMoney(currentUser.balance - amount)}`);

    if (!confirmed) return;

    // Process Withdrawal
    let users = getUsers();
    let loggedInAcc = getLoggedInUser();
    let userIndex = users.findIndex(u => u.accountNumber === loggedInAcc);
    
    if (userIndex !== -1) {
        let user = users[userIndex];
        
        // Update balance
        user.balance -= amount;
        
        // Add transaction record
        user.transactions.push({
            date: getCurrentDateTime(),
            type: "Withdraw",
            amount: amount,
            balanceAfter: user.balance
        });
        
        // Save to storage
        users[userIndex] = user;
        saveUsers(users);
        
        // Update UI
        document.getElementById("displayBalance").textContent = formatMoney(user.balance);
        document.getElementById("amount").value = "";
        
        successDiv.textContent = `${formatMoney(amount)} withdrawn successfully! Remaining balance: ${formatMoney(user.balance)}`;
        successDiv.style.display = "block";
    }
});
