# IndiChat Application 💬
> **IndiChat** is a robust, real-time messaging application built with the MERN stack (MongoDB, ExpressJS, React, Node.js). Designed for premium, low-latency, and end-to-end simulated encrypted communication.

---

## 🚀 Features

*   **Real-time Communication**: Low-latency instant messaging powered by Socket.IO.
*   **Persistent Read Receipts**: Real-time read states (`Sent`, `Delivered`, `Seen`) synced and stored in MongoDB.
*   **Live Online Presence**: Indicators displaying when users are active.
*   **Typing Indicators**: Visual feedback when contacts are typing.
*   **Simulated E2E Encryption**: AES-256 symmetric encryption of message payloads before database storage.
*   **Dual Auth System**: Secure cookie-based and Bearer-header authentication.
*   **Aesthetic Styling**: Harmony-based dark/light modes built with Tailwind CSS, custom scrollbars, and micro-animations.

---

## 📂 Project Structure Overview

```
IndiChat Application/
├── client/                   ← Vite React Front-End
│   ├── src/
│   │   ├── components/       ← UI Components (Sidebar, ChatContainer, EmojiPicker)
│   │   ├── store/            ← State management via Zustand (Auth, Chat, Theme)
│   │   ├── lib/              ← Shared utilities (Axios client, AES Encryption)
│   │   └── pages/            ← Top-level router views
│   └── vite.config.js        ← Dev Proxy for CORS-free local integration
│
└── server/                   ← Node Express Back-End
    ├── index.js              ← HTTP and Socket.IO initialization
    ├── routes/               ← Express API Routers
    ├── controllers/          ← Business logic controllers
    └── models/               ← Mongoose DB schemas (User, Message)
```

---

## 🛠️ Required Environment Variables

### Server Config (`server/.env`)
Create a `.env` file in the `server` directory:
```ini
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Client Config (`client/.env`)
Create a `.env` file in the `client` directory:
```ini
# Production URLs (only used when deployed)
VITE_API_URL=https://your-production-backend.com
VITE_SOCKET_URL=https://your-production-backend.com
```
*Note: In development mode, the frontend automatically routes all requests to port 5001 using Vite's built-in dev proxy.*

---

## 📦 Local Setup Instructions

### 1. Prerequisite
Ensure you have Node.js (version 18+) installed.

### 2. Install Dependencies
Run `npm install` at the workspace root to install dev dependencies (e.g., `concurrently`), and ensure client/server folders have their packages:
```bash
# From workspace root
npm install
```

### 3. Run Dev Server
Launch both the frontend and backend servers concurrently:
```bash
npm run dev
```
* **Frontend Access**: `http://localhost:5173/`
* **Backend Access**: `http://localhost:5001/`

---

## 🔧 Database Setup & Troubleshooting

### MongoDB Connection Timeout / ServerSelectionError
If the server starts but logs a server selection error:
```text
❌ Could not connect to MongoDB. Check your whitelists.
Error Type: MongooseServerSelectionError
```
**Root Cause**: MongoDB Atlas is blocking connection requests because your current network IP is not listed on your cluster's IP Access List.

**Solution**:
1. Log in to your **MongoDB Atlas Console**.
2. Go to **Security** → **Network Access**.
3. Click **Add IP Address** and add your current IP address (or choose **Allow Access from Anywhere** `0.0.0.0/0` for development).

---

## ⚠️ Known Limitations
* **Base64 Image Storage**: Image attachments are uploaded and stored directly as base64 text strings in MongoDB documents. In a production environment, this should be offloaded to a dedicated CDN (like Cloudinary or AWS S3) to preserve database performance.
* **Symmetric Encryption Key**: Encryption keys are shared symmetrically. For enterprise-grade security, key exchange algorithms (such as Diffie-Hellman) should be used.
