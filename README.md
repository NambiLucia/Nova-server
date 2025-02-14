# Nova Payment Management System REST API
# Overview
This is the backend service for the **Nova Payment Management System**, built with **Node.js**, **Express**, and **PostgreSQL** (managed with **Prisma**). It provides a secure and efficient way to manage organizational payments.  

## 🚀 Features
- **User Authentication**: JWT-based authentication (Register, Login, Forgot Password, Reset Password).
- **Payment**: Handles payment creation, approval, and status tracking.
- **Role-Based Access Control (RBAC)**: Secure access levels for different users.
- **File Uploads**: Uses **multer-Cloudinary** to store and manage payment-related documents.
- **Database Management**: PostgreSQL with Prisma ORM.


## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, Bcrypt
- **File Storage**: Cloudinary
- **Deployment**: Render



---

## 📌 Setup & Installation

### 1 **Clone the Repository**

`git clone https://github.com/your-username/nova-backend.git`
`cd Nova-Server`

### 2 **Install Dependencies**
`npm install`


### 2 ** Run Database Migrations**

`npx prisma migrate dev --name init`

### 3 ** Start the Server**
`Start the Server`

### 📌 API Endpoints
This Rest API has the following endpoints:
Users
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/users` | Get all registered users |
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login a registered user |
| `POST` | `/users/forgot-password` | Send reset link to email |
| `POST` | `/users/reset-password` | Set new password |

| `PATCH` | `/users/update-user/:id` | Update a registered user |
| `DELETE` | `/users/delete-user/:id` | Delete a registered user |

**`/payments`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/payments` | Get all payments |
| `GET` | `/payments/single-payment/:id` | Get a single payment by Id |
| `GET` | `/payments/payment-status/:id` | Get payment status by User Id |
| `GET` | `/payments/user-payment/:id` | Get payments by user Id |
| `POST` | `/payments/create-payment` | Add a payment |
| `PATCH` | `/payments/update-payment/:id` | Update payment |
| `DELETE` | `/payments/delete-payment/:id` | Delete payment |




**`/documents`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/documents` | Get all uploaded payment documents |



**`/budgetcodes`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/budgetcodes` | Get all budget codes |
| `POST`  | `/create-budget-code` | Create budget code |
| `PATCH`  | `/update-budget-code/:id` | Update a specific budget code |
| `DELETE` | `/delete-budget-code/:id` | Delete a specific budget code |


**`/beneficiarycodes`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/beneficiarycodes` | Get all beneficiary codes |
| `POST`  | `/create-beneficiary-code` | Create beneficiary code|
| `PATCH`  | `/update-beneficiary-code/:id` | Update a specific beneficiary code|
| `DELETE` | `/delete-beneficiary-code/:id` | Delete a specific beneficiary code |


**`/accountcodes`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/accountcodes` | Get all account codes |
| `POST`  | `/create-account-code` | Create an account code|
| `PATCH`  | `/update-account-code/:id` | Update a specific account code|
| `DELETE` | `/delete-account-code/:id` | Delete a specific account codes |



## Render
https://nova-server-hk8n.onrender.com

## 🏗️ Future Improvements

### 1. **Better UX/UI with an Enhanced Dashboard**
- Redesign the user interface for a more intuitive and seamless experience.
- Implement a modern dashboard with interactive charts, real-time transaction tracking, and customizable widgets.
- Add a dark mode and accessibility features to improve usability.

### 2. **OAuth Authentication**
- Enable users to sign up and log in using Google, Facebook, and other OAuth providers.
- Improve security by implementing multi-factor authentication (MFA) as an option.
- Streamline the onboarding process for new users.

### 3. **Expanded Role-Based Access Control (RBAC)**
- Introduce new roles such as **Reviewer** and **Approver** to improve workflow efficiency.
- Define granular permissions for each role to ensure secure access control.
- Implement audit logs to track actions performed by different roles.

## 🤝 Contributing
Contributions are welcome! Fork the repo and submit a pull request.

## 📜 License
This project is licensed under the MIT License.

