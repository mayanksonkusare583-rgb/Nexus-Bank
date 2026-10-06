/**
 * profile.js
 * Handles viewing and editing of user profile details,
 * changing PIN, and deleting account.
 */

checkLogin();

document.addEventListener("DOMContentLoaded", function() {
    loadProfileData();

    // Edit button click event
    document.getElementById("editBtn").addEventListener("click", function() {
        // Enable fields
        document.getElementById("profName").disabled = false;
        document.getElementById("profMobile").disabled = false;
        document.getElementById("profEmail").disabled = false;
        document.getElementById("profAddress").disabled = false;

        // Toggle buttons
        this.style.display = "none";
        document.getElementById("saveBtn").style.display = "inline-block";
        document.getElementById("successMsg").style.display = "none";
    });

    // Change PIN form submission
    document.getElementById("changePinForm").addEventListener("submit", handleChangePin);

    // Delete Account button
    document.getElementById("deleteAccountBtn").addEventListener("click", function() {
        showDeleteModal();
    });

    // Modal Cancel button
    document.getElementById("modalCancelBtn").addEventListener("click", function() {
        hideDeleteModal();
    });

    // Modal Confirm button
    document.getElementById("modalConfirmBtn").addEventListener("click", function() {
        handleDeleteAccount();
    });

    // Close modal when clicking outside the box
    document.getElementById("confirmModal").addEventListener("click", function(e) {
        if (e.target === this) {
            hideDeleteModal();
        }
    });
});

function loadProfileData() {
    let currentUser = getCurrentUser();
    
    document.getElementById("profAccNumber").value = currentUser.accountNumber;
    document.getElementById("profAccType").value = currentUser.accountType;
    document.getElementById("profName").value = currentUser.name;
    document.getElementById("profMobile").value = currentUser.mobile;
    document.getElementById("profEmail").value = currentUser.email;
    document.getElementById("profAddress").value = currentUser.address;
}

// ============== PROFILE UPDATE ==============

document.getElementById("profileForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("profName").value.trim();
    let mobile = document.getElementById("profMobile").value.trim();
    let email = document.getElementById("profEmail").value.trim();
    let address = document.getElementById("profAddress").value.trim();

    // Reset error messages
    document.querySelectorAll("#profileForm .error-message").forEach(el => el.style.display = "none");

    let isValid = true;
    let currentUser = getCurrentUser();

    // Validations (same as register.js)
    if (!/^[A-Za-z\s]{3,}$/.test(name)) {
        showProfError("nameError", "Name must contain only letters and be at least 3 characters.");
        isValid = false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        showProfError("mobileError", "Enter a valid 10-digit mobile number.");
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showProfError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    if (address.length < 5) {
        showProfError("addressError", "Address must be at least 5 characters long.");
        isValid = false;
    }

    // Check if new mobile or email is already taken by ANOTHER user
    let users = getUsers();
    let duplicate = users.find(u => (u.mobile === mobile || u.email === email) && u.accountNumber !== currentUser.accountNumber);
    
    if (duplicate) {
        alert("Mobile number or Email is already in use by another account.");
        isValid = false;
    }

    if (isValid) {
        // Update user data
        let userIndex = users.findIndex(u => u.accountNumber === currentUser.accountNumber);
        if (userIndex !== -1) {
            users[userIndex].name = name;
            users[userIndex].mobile = mobile;
            users[userIndex].email = email;
            users[userIndex].address = address;

            saveUsers(users);

            // UI feedback
            let successDiv = document.getElementById("successMsg");
            successDiv.textContent = "Profile updated successfully!";
            successDiv.style.display = "block";

            // Disable fields again
            document.getElementById("profName").disabled = true;
            document.getElementById("profMobile").disabled = true;
            document.getElementById("profEmail").disabled = true;
            document.getElementById("profAddress").disabled = true;

            // Toggle buttons
            document.getElementById("saveBtn").style.display = "none";
            document.getElementById("editBtn").style.display = "inline-block";
        }
    }
});

// ============== CHANGE PIN ==============

function handleChangePin(event) {
    event.preventDefault();

    let currentPin = document.getElementById("currentPin").value.trim();
    let newPin = document.getElementById("newPin").value.trim();
    let confirmNewPin = document.getElementById("confirmNewPin").value.trim();

    // Reset messages
    document.getElementById("pinSuccessMsg").style.display = "none";
    document.getElementById("pinErrorMsg").style.display = "none";
    document.getElementById("currentPinError").style.display = "none";
    document.getElementById("newPinError").style.display = "none";
    document.getElementById("confirmNewPinError").style.display = "none";

    let isValid = true;
    let currentUser = getCurrentUser();

    // Validate current PIN
    if (!/^\d{4}$/.test(currentPin)) {
        showProfError("currentPinError", "PIN must be exactly 4 digits.");
        isValid = false;
    } else if (currentPin !== currentUser.pin) {
        showProfError("currentPinError", "Current PIN is incorrect.");
        isValid = false;
    }

    // Validate new PIN format
    if (!/^\d{4}$/.test(newPin)) {
        showProfError("newPinError", "New PIN must be exactly 4 digits.");
        isValid = false;
    } else if (newPin === currentPin) {
        showProfError("newPinError", "New PIN cannot be the same as current PIN.");
        isValid = false;
    }

    // Validate confirm PIN
    if (newPin !== confirmNewPin) {
        showProfError("confirmNewPinError", "PINs do not match.");
        isValid = false;
    }

    if (isValid) {
        let users = getUsers();
        let userIndex = users.findIndex(u => u.accountNumber === currentUser.accountNumber);

        if (userIndex !== -1) {
            users[userIndex].pin = newPin;
            saveUsers(users);

            // Clear fields
            document.getElementById("currentPin").value = "";
            document.getElementById("newPin").value = "";
            document.getElementById("confirmNewPin").value = "";

            // Show success
            let successDiv = document.getElementById("pinSuccessMsg");
            successDiv.textContent = "PIN changed successfully!";
            successDiv.style.display = "block";
        }
    }
}

// ============== DELETE ACCOUNT ==============

function showDeleteModal() {
    let currentUser = getCurrentUser();
    document.getElementById("modalMessage").textContent = 
        `Are you sure you want to permanently delete account ${currentUser.accountNumber} (${currentUser.name})? This action cannot be undone.`;
    document.getElementById("modalPinInput").value = "";
    document.getElementById("modalPinError").style.display = "none";
    document.getElementById("confirmModal").style.display = "flex";
}

function hideDeleteModal() {
    document.getElementById("confirmModal").style.display = "none";
}

function handleDeleteAccount() {
    let pinInput = document.getElementById("modalPinInput").value.trim();
    let currentUser = getCurrentUser();

    // Validate PIN
    if (!/^\d{4}$/.test(pinInput)) {
        showProfError("modalPinError", "Enter a valid 4-digit PIN.");
        return;
    }

    if (pinInput !== currentUser.pin) {
        showProfError("modalPinError", "Incorrect PIN. Account not deleted.");
        return;
    }

    // Check if account still has balance
    if (currentUser.balance > 0) {
        showProfError("modalPinError", `Please withdraw your remaining balance of ${formatMoney(currentUser.balance)} before deleting.`);
        return;
    }

    // Delete the account from users array using filter()
    let users = getUsers();
    let updatedUsers = users.filter(u => u.accountNumber !== currentUser.accountNumber);
    saveUsers(updatedUsers);

    // Clear session
    localStorage.removeItem("loggedInUser");

    // Redirect to home page with a message
    alert("Account deleted successfully. You will be redirected to the home page.");
    window.location.href = "index.html";
}

// ============== HELPER ==============

function showProfError(elementId, message) {
    let errDiv = document.getElementById(elementId);
    errDiv.textContent = message;
    errDiv.style.display = "block";
}
