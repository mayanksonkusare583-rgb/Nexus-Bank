/**
 * login.js
 * Handles user login and session creation.
 */

// If already logged in, redirect to dashboard
if (getLoggedInUser()) {
    window.location.href = "dashboard.html";
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let accNumber = document.getElementById("accNumber").value.trim();
    let pin = document.getElementById("pin").value.trim();
    
    // Reset errors
    document.getElementById("errorMsg").style.display = "none";
    document.getElementById("accError").style.display = "none";
    document.getElementById("pinError").style.display = "none";

    let isValid = true;

    // Validate Account Number format
    if (!/^\d{10}$/.test(accNumber)) {
        document.getElementById("accError").textContent = "Account number must be 10 digits.";
        document.getElementById("accError").style.display = "block";
        isValid = false;
    }

    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
        document.getElementById("pinError").textContent = "PIN must be 4 digits.";
        document.getElementById("pinError").style.display = "block";
        isValid = false;
    }

    if (isValid) {
        let users = getUsers();
        
        // Find user by account number AND pin
        let matchedUser = users.find(u => u.accountNumber === accNumber && u.pin === pin);

        if (matchedUser) {
            // Login successful: Save account number to session (localStorage)
            localStorage.setItem("loggedInUser", matchedUser.accountNumber);
            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            // Login failed
            let errorDiv = document.getElementById("errorMsg");
            errorDiv.textContent = "Invalid Account Number or PIN.";
            errorDiv.style.display = "block";
        }
    }
});
