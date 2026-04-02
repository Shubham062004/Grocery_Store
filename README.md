# 🛒 FreshCart: Multi-Merchant Grocery Platform

A modern, full-stack, production-ready grocery store management system. Featuring role-based authentication, merchant management, inventory tracking, and a seamless shopping experience for customers.

![FreshCart Dashboard](https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200&h=400)

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Architecture](#-architecture)
- [📦 Setup & Installation](#-setup--installation)
- [🔐 Role-Based Access](#-role-based-access)
- [💡 Design Philosophy](#-design-philosophy)
- [🌐 Deployment](#-deployment)

---

## ✨ Key Features

### 🛍️ For Customers
- **Dynamic Product Browsing**: Enhanced filtering by category and availability.
- **Rich Product Details**: Comprehensive info (nutritional facts, expiration, packaging integrity).
- **Persistent Cart & Wishlist**: Save items for later with persistent state management.
- **Order Tracking**: Complete history of past orders with status updates.
- **Seamless Checkout**: Simple, intuitive ordering process.

### 👨‍💼 For Merchants
- **Personalized Dashboard**: Real-time sales metrics and order management.
- **Inventory Control**: Add, update, and delete products easily.
- **Store Customization**: Manage store profile and branding.
- **Stock Tracking**: Automatic stock updates upon order fulfillment.

### 🛡️ Security & Auth
- **JWT Authentication**: Secure login and sign-up with role-based routing.
- **Protected Routes**: Middleware enforcement to prevent unauthorized access.
- **Password Hashing**: Secure storage using Bcrypt.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Data Fetching**: Tanstack Query (React Query) + Axios
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB (Atlas) + Mongoose
- **Auth**: JSON Web Tokens (JWT)
- **Validation**: Zod + Express Middleware

---

## 🚀 Architecture

The application follows a modular **Client-Server** architecture:

- `client/`: A Vite-powered React application using a component-driven design.
- `server/`: An Express.js REST API using the MVC (Model-View-Controller) pattern.

---

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5100
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Role-Based Access

| Feature | Customer | Merchant | Admin |
|---------|:---:|:---:|:---:|
| Browse Products | ✅ | ✅ | ✅ |
| Place Orders | ✅ | ❌ | ❌ |
| Manage Inventory | ❌ | ✅ | ✅ |
| Manage Stores | ❌ | ✅ | ✅ |
| Access Dashboard | ❌ | ✅ | ✅ |

---

## 💡 Design Philosophy

- **User-Centric**: Modal-based flows for quick interactions without page reloads.
- **Atomic Components**: Reusable UI elements built on top of Radix UI.
- **Visual Feedback**: Micro-animations and toast notifications for every user action.
- **Type Safety**: End-to-end TypeScript integration to minimize runtime errors.

---

## 🌐 Deployment

- **Frontend**: [Vercel](https://grocery-store-client-rose.vercel.app/)
- **Backend**: Can be deployed to Render, Heroku, or DigitalOcean.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- MONGODB_URI=mongodb+srv://shubhamkumar081908:Q1234098@cluster0.7ydpad4.mongodb.net/grocery_store -->
