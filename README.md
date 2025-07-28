# 🥗 MealVoucher API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Redis](https://img.shields.io/badge/Redis-Queue-red)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A robust meal voucher management system designed to streamline staff meal entitlements, vendor redemption, and HR-issued visitor vouchers. This backend API is built for organizations that subsidize employee meals and require a secure, auditable, and automated process.

---

## 🔧 Features

- ⏱ **Automated Weekly Voucher Generation** (via CRON)
- 🧾 **Voucher Purchase & Wallet System**
- 🔁 **Voucher Rollover & Expiry Logic**
- 🎟 **Staff, Visitor & Special Voucher Support**
- 🔒 **Role-based Access Control (Admin, Staff, Vendor)**
- 🛒 **Meal Redemption & Vendor Reconciliation**
- 📊 **Analytics Dashboard Support**
- 📤 **CSV Upload for Bulk HR Operations**
- 📬 **Background Email Notifications via Redis Queue**
- ✅ **Tested API with Postman & Swagger compatibility**

---

## 🧱 Tech Stack

| Layer         | Tech                                           |
|---------------|------------------------------------------------|
| Language      | Node.js (18.x)                                 |
| Framework     | Express.js                                     |
| Database      | PostgreSQL + Sequelize ORM                     |
| Queue System  | Redis + BullMQ                                 |
| Auth          | JWT + Bcrypt                                   |
| Uploads       | Multer (CSV)                                   |
| Dev Tools     | ESLint, Nodemon, Swagger, Postman              |

---

## 📦 Installation

```bash
git clone https://github.com/your-username/mealvoucher-api.git
cd mealvoucher-api
npm install
