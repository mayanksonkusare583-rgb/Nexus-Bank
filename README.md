# Nexus Bank - Banking System Application

## Project Description
A modern, frontend-only banking system web application developed as a Mini Hackathon project for Web Technology Lab (23CT1301). It simulates basic banking operations like creating an account, logging in, viewing balance, depositing, withdrawing, and transferring money. All data is persisted using the browser's `localStorage`.

## Features
- **User Registration**: Create a new account (Savings/Current) with robust client-side validation. Auto-generates a 10-digit account number.
- **User Login**: Login securely using Account Number and a 4-digit PIN.
- **Dashboard**: View current balance, account details, and recent transactions with total deposit/withdrawal summary.
- **Deposit Money**: Add money to your account with amount validation.
- **Withdraw Money**: Withdraw money with insufficient balance checks and **confirmation dialog**.
- **Transfer Money**: Send money to another registered user with **confirmation dialog** showing receiver details. Updates balances and transaction history for both sender and receiver.
- **Transaction History**: View all transactions, filter by type (Deposit/Withdraw/Transfer), and see transaction count.
- **Download Account Statement**: Export a formatted `.txt` account statement file using Blob API.
- **Profile Management**: View and edit user details (Name, Mobile, Email, Address).
- **Change PIN**: Update your 4-digit PIN with current PIN verification.
- **Delete Account**: Permanently delete your account (requires PIN verification and zero balance).

## Technologies Used
- HTML5 (Semantic markup, SEO meta tags)
- CSS3 (Custom Properties, Gradients, Animations, Flexbox, Grid, Media Queries)
- JavaScript (Vanilla, ES6 features: `find()`, `filter()`, `map()`, `reduce()`, `forEach()`, `findIndex()`, `some()`, `Blob`, Template Literals, Arrow Functions, Spread Operator)
- LocalStorage (for data persistence)
- Google Fonts (Inter)

## Key JavaScript Concepts Demonstrated
| Concept | Where Used |
|---|---|
| `find()` | Login, Transfer (find receiver by account number) |
| `findIndex()` | Deposit, Withdraw, Transfer, Profile (locate user in array) |
| `filter()` | History (filter by type), Delete Account (remove user) |
| `map()` | History, Dashboard (generate table rows) |
| `reduce()` | Dashboard (calculate total deposits/withdrawals) |
| `forEach()` | Download Statement (iterate transactions) |
| `some()` | Transfer (check if receiver exists) |
| `Blob` | Download Statement (generate downloadable file) |
| `RegExp` | Registration, Login, Profile (input validation) |
| `confirm()` | Withdraw, Transfer (confirmation dialogs) |
| `localStorage` | All pages (data persistence and session management) |
| Spread Operator `[...]` | History (copy array before reversing) |
| Template Literals | All pages (dynamic HTML generation) |

## Folder Structure
```text
banking-system/
├── index.html          (Home page with hero section)
├── register.html       (Create Account with validation)
├── login.html          (Login with session creation)
├── dashboard.html      (Account Dashboard with stats)
├── deposit.html        (Deposit Money)
├── withdraw.html       (Withdraw Money with confirmation)
├── transfer.html       (Transfer Money with confirmation)
├── history.html        (Transaction History + Download)
├── profile.html        (Profile + Change PIN + Delete Account)
├── css/
│   └── style.css       (Modern responsive stylesheet)
├── js/
│   ├── storage.js      (LocalStorage helpers + session management)
│   ├── register.js     (Registration logic + validation)
│   ├── login.js        (Login authentication)
│   ├── dashboard.js    (Dashboard data loading)
│   ├── deposit.js      (Deposit processing)
│   ├── withdraw.js     (Withdraw with confirmation)
│   ├── transfer.js     (Transfer with confirmation)
│   ├── history.js      (History + filter + download statement)
│   └── profile.js      (Profile edit + Change PIN + Delete Account)
└── README.md
```

## How to Run
1. No server or build tools are required.
2. Simply double-click on `index.html` to open it in any modern web browser.
3. Use the navigation links to interact with the application.

## How to Use & Test Flow
1. **Register**: Click "Register" on the Home page. Fill in the details. Remember the generated Account Number and your 4-digit PIN.
2. **Login**: Click "Login", enter your Account Number and PIN.
3. **Dashboard**: You will see your balance is ₹ 0.00 with deposit/withdrawal summaries.
4. **Deposit**: Go to "Deposit", enter an amount (e.g., 5000), and submit. Check your updated balance on the Dashboard.
5. **Withdraw**: Go to "Withdraw", enter an amount (e.g., 1000). A confirmation dialog will appear before processing.
6. **Register a second user**: Logout, register a new account, and login with the new account.
7. **Transfer**: Login to the first account. Go to "Transfer". Enter the second user's Account Number and an amount. A confirmation dialog shows receiver details before processing.
8. **History**: Go to "History" to view and filter your past transactions. Click "Download Statement" to save a `.txt` file.
9. **Profile**: Go to "Profile" to edit your personal information.
10. **Change PIN**: On the Profile page, scroll down to the "Change PIN" section to update your PIN.
11. **Delete Account**: On the Profile page, use the "Danger Zone" section to permanently delete your account (requires zero balance and PIN verification).

## Design Features
- Modern gradient navbar with sticky positioning
- Animated card hover effects with shadow transitions
- Form inputs with focus glow rings
- Gradient buttons with hover lift animations
- Color-coded transaction types (green for deposits, red for withdrawals)
- Responsive layout supporting mobile, tablet, and desktop
- Custom modal for account deletion confirmation
- Google Fonts (Inter) for professional typography

## Git Instructions (To push to GitHub)
```bash
git init
git add .
git commit -m "Initial commit - Complete Banking System Project"
git remote add origin <your-github-repo-url>
git push -u origin master
```

## Team Members
- [Your Name / Roll No]
- [Team Member 2 Name / Roll No]
