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

git clone https://github.com/your-username/nova-backend.git
cd nova-backend

### 2 **Install Dependencies**

npm install

### 2 ** Run Database Migrations**

npx prisma migrate dev --name init
### 3 ** Start the Server**
Start the Server

### 📌 API Endpoints
This Rest API has the following endpoints:
Users
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/users` | Get all registered users |
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login a registered user |

**`/vendors`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/vendors` | Get all registered vendors |
| `POST` | `/vendors/register` | Register a new vendor |
| `POST` | `/vendors/login` | Login a registered vendor |


**`/categories`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/categories` | Get all vendor categories |
| `POST` | `/categories` | Create a new vendor category |
| `PUT`  | `/categories/:id` | Update a specific vendor category |
| `DELETE` | `/categories/:id` | Delete a specific vendor category |


**`/bookings`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/bookings` | Get all bookings |
| `GET`  | `/bookings/:slug` | Get bookings by a specific identifier |
| `GET`  | `/bookings/couples/:id` | Get all bookings by a specific couple |
| `POST` | `/bookings/create-booking` | Create a new booking |
| `PUT`  | `/bookings/:id` | Update a specific booking |
| `DELETE` | `/bookings/:id` | Delete a specific booking |


## Render
https://nova-server-hk8n.onrender.com

## 🏗️ Future Improvements
Integration with third-party payment gateways.
Role-based dashboard analytics & reporting.
Real-time notifications for payment approvals.
## 🤝 Contributing
Contributions are welcome! Fork the repo and submit a pull request.

## 📜 License
This project is licensed under the MIT License.

### Developed with ❤️ by Your Name