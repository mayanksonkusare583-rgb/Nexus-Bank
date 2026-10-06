/**
 * storage.js
 * This file contains reusable functions for accessing localStorage,
 * formatting data, and handling user sessions.
 * It should be included in every HTML page before the page-specific script.
 */

// Function to get all users from localStorage
function getUsers() {
    let users = localStorage.getItem("bankUsers");
    if (users) {
        return JSON.parse(users);
    } else {
        return []; // Return empty array if no users exist
    }
}

// Function to save the users array back to localStorage
function saveUsers(usersArray) {
    localStorage.setItem("bankUsers", JSON.stringify(usersArray));
}

// Function to get the logged-in user's account number
function getLoggedInUser() {
    return localStorage.getItem("loggedInUser");
}

// Function to get the full user object of the currently logged-in user
function getCurrentUser() {
    let accNumber = getLoggedInUser();
    if (!accNumber) return null;

    let users = getUsers();
    // Use find() to locate the user by account number
    let user = users.find(u => u.accountNumber === accNumber);
    return user || null;
}

// Format number to currency format (e.g., ₹ 5,000.00)
function formatMoney(amount) {
    return "₹ " + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get current date and time formatted as "MM/DD/YYYY, HH:MM AM/PM"
function getCurrentDateTime() {
    let now = new Date();
    return now.toLocaleString('en-IN');
}

// Protect pages: if user is not logged in, redirect to login page
function checkLogin() {
    if (!getLoggedInUser()) {
        window.location.href = "login.html";
    }
}

// Setup logout button functionality if it exists on the page
document.addEventListener("DOMContentLoaded", function() {
    let logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }
});
