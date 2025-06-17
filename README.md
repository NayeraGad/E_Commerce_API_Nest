# 🛒 NestJS E-Commerce API

A full-featured E-Commerce backend API built using [NestJS](https://nestjs.com/) and [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/). This project is designed with modularity, scalability, and best practices in mind — ideal for powering modern e-commerce platforms.

---

## ✨ Features

- ✅ RESTful API architecture
- 🛍️ Product management (CRUD, categories, inventory)
- 👤 User authentication (JWT + hashed passwords)
- 📧 Email verification and password reset
- 🛒 Cart and order system
- 💳 Payment integration ready (Stripe)
- 🎟️ Discount and coupon system
- 🔐 Role-based access control (Admin, User)
- 📦 File upload support (Cloudinary ready)
- 📊 Pagination, filtering, and sorting
- 🔍 GraphQL support (in addition to REST)
- 📁 Modular and maintainable folder structure
- 🧪 Unit & e2e testing ready (Jest + Supertest)

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** MongoDB (via [Mongoose](https://mongoosejs.com/))
- **Auth:** JWT, Bcrypt
- **ORM/ODM:** Mongoose
- **File Storage:** Cloudinary
- **Testing:** Jest & Supertest
- **Validation:** class-validator & class-transformer

---

## 🚧 Future Improvements

- Product reviews & ratings
- Admin dashboard integration
- Wishlist & saved items

---

## 🚀 Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/NayeraGad/E_Commerce_API_Nest.git
cd E_Commerce_API_Nest
```

### 2. Install dependencies
```bash
npm install
```

```
PORT=3000

# MongoDB Connection
URI=your_mongodb_connection_string

# Encryption
SALT_ROUNDS=your_salt_round_value
SECRET_KEY=your_super_secret_key

# Email Configuration 
EMAIL=your_email@example.com
PASSWORD=your_email_app_password

# Token
SIGNATURE_ACCESS_USER=user_access_token_secret
SIGNATURE_ACCESS_ADMIN=admin_access_token_secret
SIGNATURE_REFRESH_USER=user_refresh_token_secret
SIGNATURE_REFRESH_ADMIN=admin_refresh_token_secret

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=your_folder_name

# Stripe
STRIPE_SECRET=your_stripe_secret_key
```
---

## 📫 API Documentation
📘 **Postman Collection (Demo)**  
> Even though the app is not deployed, you can still explore and test the endpoints via the Postman documentation:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/36251048/2sB2cPjkcn)