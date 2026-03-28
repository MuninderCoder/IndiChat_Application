# IndiChat Application 💬

IndiChat is a robust, real-time messaging application built with the MERN stack (MongoDB, Express.js, React, Node.js). Designed for seamless communication, it features instantaneous message delivery, online presence tracking, and a sleek, user-friendly interface.

## 🚀 Features

*   **Real-time Communication**: Instant messaging powered by Socket.io for low-latency chat experiences.
*   **User Authentication**: Secure JWT-based signup and login with hashed passwords using bcryptjs.
*   **Message Status Tracking**: Real-time status updates (Sent, Delivered, Seen) so you always know when your messages are read.
*   **Online Presence**: Live indicator of when your friends are online and active.
*   **Typing Indicators**: Visual feedback when your contact is typing a message.
*   **Profile Customization**: Users can update their profile information and avatars.
*   **Responsive Design**: A fully responsive UI that looks great on mobile and desktop, built with Tailwind CSS.
*   **Toaster Notifications**: Smooth and non-intrusive UI feedback using React Hot Toast.

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern UI development.
- **Vite**: Ultra-fast build tool for local development.
- **Tailwind CSS**: Utility-first CSS for styling.
- **Zustand**: State management for real-time authentication and chat.
- **Socket.io Client**: For persistent real-time connections.
- **React Router Dom**: Client-side navigation.

### Backend
- **Node.js & Express**: High-performance backend routing and server logic.
- **MongoDB & Mongoose**: Flexible NoSQL database for messages and user data.
- **Socket.io**: Real-time server-side engine for chat functionality.
- **JWT (JSON Web Token)**: Secure authentication and session management.
- **Cookie Parser**: Secure cookie handling for auth tokens.

## 📦 Getting Started

To run this project locally, follow these steps:

### Prerequisites
- Node.js installed
- MongoDB URI (local or Atlas)

### Local Setup

1.  **Clone the repository**:
    ```bash
    git clone [your-repo-url]
    cd IndiChat_Application
    ```

2.  **Server Setup**:
    ```bash
    cd server
    npm install
    cp .env.example .env # Add your MONGODB_URI and JWT_SECRET
    npm start
    ```

3.  **Client Setup**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

---
*Optimized build - Clean, lightweight, and ready for deployment.*
