/**
 * register.js
 * Handles validation and creation of new user accounts.
 */

document.getElementById("registerForm").addEventListener("submit", function(event) {
    // Prevent the default form submission (page reload)
    event.preventDefault();

    // Get input values
    let fullName = document.getElementById("fullName").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let email = document.getElementById("email").value.trim();
    let address = document.getElementById("address").value.trim();
    let accType = document.getElementById("accType").value;
    let pin = document.getElementById("pin").value.trim();
    let confirmPin = document.getElementById("confirmPin").value.trim();

    // Reset error messages
    document.querySelectorAll(".error-message").forEach(el => el.style.display = "none");
    document.getElementById("successMsg").style.display = "none";

    let isValid = true;

    // Name Validation: only letters and spaces, min 3 chars
    let nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(fullName)) {
        showError("nameError", "Name must contain only letters and be at least 3 characters long.");
        isValid = false;
    }

    // Mobile Validation: 10 digits, starts with 6,7,8,9
    let mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        showError("mobileError", "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
        isValid = false;
    }

    // Email Validation: standard email format
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    // Address Validation: min 5 chars
    if (address.length < 5) {
        showError("addressError", "Address must be at least 5 characters long.");
        isValid = false;
    }

    // Account Type Validation
    if (accType === "") {
        showError("accTypeError", "Please select an account type.");
        isValid = false;
    }

    // PIN Validation: exactly 4 digits
    let pinRegex = /^\d{4}$/;
    if (!pinRegex.test(pin)) {
        showError("pinError", "PIN must be exactly 4 digits.");
        isValid = false;
    }

    // Confirm PIN Validation
    if (pin !== confirmPin) {
        showError("confirmPinError", "PINs do not match.");
        isValid = false;
    }

    if (isValid) {
        let users = getUsers();

        // Check if mobile or email already exists using find()
        let existingUser = users.find(u => u.mobile === mobile || u.email === email);
        if (existingUser) {
            alert("An account with this Mobile Number or Email already exists!");
            return;
        }

        // Generate Account Number
        // Start from 1000000001, if users exist, add 1 to the last user's account number
        let newAccNumber = "1000000001";
        if (users.length > 0) {
            let lastUser = users[users.length - 1];
            newAccNumber = (parseInt(lastUser.accountNumber) + 1).toString();
        }

        // Create new user object
        let newUser = {
            accountNumber: newAccNumber,
            name: fullName,
            mobile: mobile,
            email: email,
            address: address,
            accountType: accType,
            pin: pin,
            balance: 0,
            transactions: [] // Empty array for transactions
        };

        // Add to array and save
        users.push(newUser);
        saveUsers(users);

        // Show success message and Account Number
        let successDiv = document.getElementById("successMsg");
        successDiv.innerHTML = `Registration Successful!<br><strong>Your Account Number is: ${newAccNumber}</strong><br>Please keep this safe for login.`;
        successDiv.style.display = "block";

        // Hide form and update login link
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("loginLinkContainer").innerHTML = `<a href="login.html" class="btn-primary" style="display:inline-block; text-decoration:none;">Go to Login</a>`;
    }
});

// Helper function to show error message under specific field
function showError(elementId, message) {
    let errDiv = document.getElementById(elementId);
    errDiv.textContent = message;
    errDiv.style.display = "block";
}
