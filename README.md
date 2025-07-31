# 💬 ChatOn — Real-time Chat App

ChatOn is a full-stack, real-time chat application built with the **MERN** stack — MongoDB, Express.js, React, Node.js — and powered by **Socket.IO** for instant messaging. It also features image sharing, JWT authentication, and responsive UI using **TailwindCSS + DaisyUI**.

---

## 🔧 Tech Stack

### 🖥️ Frontend

- **React** + **TypeScript**
- **Tailwind CSS** + **DaisyUI** for styling
- **Zustand** for global state management
- **Axios** for API communication
- **Socket.IO Client** for real-time communication
- **React Hot Toast** for notifications
- **React Router DOM v7**

### 🌐 Backend

- **Node.js** + **Express.js**
- **MongoDB Atlas** for database
- **Cloudinary** to upload and store images (max size: 10MB)
- **Socket.IO** for real-time chat
- **JWT** (JSON Web Tokens) for authentication
- **bcryptjs** for password hashing
- **cookie-parser** for managing cookies

---

## 🧩 Features

- 🔐 **Authentication** (JWT-based with secure cookies)
- 📤 **Send/receive messages** in real-time
- 🖼️ **Image sharing** (stored via Cloudinary)
- 👥 **User list and selection**
- 🌐 **Responsive Design**
- 🧪 **Postman-tested REST APIs**
- 🧠 **Global state with Zustand**

---

## 📁 Folder Structure

```
/frontend
  └── src/
        ├── components/
        ├── pages/
        ├── store/
        ├── utils/
        └── App.tsx

/backend
  └── src/
        ├── controllers/
        ├── routes/
        ├── models/
        ├── middlewares/
        ├── lib/
        ├── seeds/
        └── index.js
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Laxman-Katneni/ChatOn.git
cd ChatOn
```

### 2. Setup Environment Variables

Create `.env` files in both `/frontend` and `/backend` with appropriate keys (e.g., MongoDB URI, JWT secret, Cloudinary credentials).

### 3. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 4. Run the App

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

---

## 📬 Contact

Built with ❤️ by **Laxman Katneni**

- GitHub: [@Laxman-Katneni](https://github.com/Laxman-Katneni)
- LinkedIn: [in/laxman-katneni](https://linkedin.com/in/laxman-katneni)
