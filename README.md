# 💰 Expense Tracker Web App

A **full-stack expense tracker** web application that enables users to manage their daily expenses, upgrade to premium features, and securely download their data. Built using modern web technologies with a focus on authentication, payment integration, and cloud storage.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure user signup and login.
  - Passwords encrypted using **bcrypt**.
  - Session management via **JSON Web Tokens (JWT)**.

- 💸 **Expense Management**
  - Add new expenses with amount, description, and category.
  - View a list of all past expenses.
  - Delete unwanted or outdated expenses.

- 💳 **Premium Membership**
  - Upgrade to premium using **Razorpay** payment gateway.
  - Unlock access to premium-only features like analytics and downloads.

- ☁ **Cloud File Download**
  - Premium users can download their expense data as **CSV files**.
  - Files are securely stored and served from **AWS S3** cloud storage.

- 📊 **Premium Dashboard**
  - Interactive charts and graphs for visualizing spending.
  - Insights by category and time (monthly/yearly breakdowns).
  - Only available to premium users.

- 🧾 **SQL & NoSQL Database Support**
  - **MySQL + Sequelize** for structured relational data.
  - **MongoDB + Mongoose** for flexible document-based storage.
  - Offers scalability and adaptability for different use cases.


---

## 🛠 Tech Stack

| Area            | Technology Used                           |
|-----------------|--------------------------------------------|
| Frontend        | HTML, CSS, JavaScript                      |
| Backend         | Node.js, Express.js                        |
| Authentication  | bcrypt, JSON Web Tokens (JWT)              |
| Database        | Sequelize (MySQL), Mongoose (MongoDB) |
| Payments        | Razorpay Payment Gateway                   |
| Cloud Storage   | AWS S3 (for secure file download)          |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/anujdubey-22/expense-tracker-app.git
cd expense-tracker-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in required keys in .env (JWT_SECRET, DB configs, Razorpay keys, AWS keys, etc.)

# Run the application
npm start
