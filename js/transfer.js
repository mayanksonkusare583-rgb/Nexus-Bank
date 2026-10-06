/**
 * transfer.js
 * Handles money transfer between users with confirmation dialog.
 */

checkLogin();

document.addEventListener("DOMContentLoaded", function() {
    let currentUser = getCurrentUser();
    document.getElementById("displayBalance").textContent = formatMoney(currentUser.balance);
});

document.getElementById("transferForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let receiverAcc = document.getElementById("receiverAcc").value.trim();
    let amountInput = document.getElementById("amount").value;
    let amount = parseFloat(amountInput);
    
    let receiverError = document.getElementById("receiverError");
    let amountError = document.getElementById("amountError");
    let successDiv = document.getElementById("successMsg");
    
    receiverError.style.display = "none";
    amountError.style.display = "none";
    successDiv.style.display = "none";

    let isValid = true;
    let users = getUsers();
    let senderAcc = getLoggedInUser();
    let receiverName = "";

    // Receiver validation
    if (!/^\d{10}$/.test(receiverAcc)) {
        receiverError.textContent = "Receiver account number must be 10 digits.";
        receiverError.style.display = "block";
        isValid = false;
    } else if (receiverAcc === senderAcc) {
        receiverError.textContent = "You cannot transfer money to yourself.";
        receiverError.style.display = "block";
        isValid = false;
    } else {
        // Check if receiver exists
        let receiver = users.find(u => u.accountNumber === receiverAcc);
        if (!receiver) {
            receiverError.textContent = "Receiver account does not exist.";
            receiverError.style.display = "block";
            isValid = false;
        } else {
            receiverName = receiver.name;
        }
    }

    // Amount validation
    let currentUser = getCurrentUser();
    if (isNaN(amount) || amount <= 0) {
        amountError.textContent = "Please enter a valid positive amount.";
        amountError.style.display = "block";
        isValid = false;
    } else if (amount > currentUser.balance) {
        amountError.textContent = "Insufficient balance!";
        amountError.style.display = "block";
        isValid = false;
    }

    if (isValid) {
        // Confirm transfer with receiver details using confirm()
        let confirmed = confirm(
            `Confirm Transfer Details:\n\n` +
            `To: ${receiverName} (A/c ${receiverAcc})\n` +
            `Amount: ${formatMoney(amount)}\n` +
            `Your balance after transfer: ${formatMoney(currentUser.balance - amount)}\n\n` +
            `Proceed with transfer?`
        );

        if (!confirmed) return;

        let senderIndex = users.findIndex(u => u.accountNumber === senderAcc);
        let receiverIndex = users.findIndex(u => u.accountNumber === receiverAcc);
        
        let dateNow = getCurrentDateTime();

        // 1. Update Sender
        users[senderIndex].balance -= amount;
        users[senderIndex].transactions.push({
            date: dateNow,
            type: `Transfer Sent to ${receiverAcc}`,
            amount: amount,
            balanceAfter: users[senderIndex].balance
        });

        // 2. Update Receiver
        users[receiverIndex].balance += amount;
        users[receiverIndex].transactions.push({
            date: dateNow,
            type: `Transfer Received from ${senderAcc}`,
            amount: amount,
            balanceAfter: users[receiverIndex].balance
        });

        // Save both to storage
        saveUsers(users);

        // Update UI
        document.getElementById("displayBalance").textContent = formatMoney(users[senderIndex].balance);
        document.getElementById("receiverAcc").value = "";
        document.getElementById("amount").value = "";
        
        successDiv.textContent = `${formatMoney(amount)} successfully transferred to ${receiverName} (A/c ${receiverAcc}).`;
        successDiv.style.display = "block";
    }
});
