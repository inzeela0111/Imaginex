<div align="center">
  <h1>🌌 ImagineX</h1>
  <p><strong>A Modern AI-Powered Social Media Platform where Creativity meets Artificial Intelligence.</strong></p>
  <a href="https://imaginex-km5j.onrender.com/"><strong>View Live Demo</strong></a>
</div>

<br />

## 🚀 Overview

**ImagineX** combines the power of AI image generation with a full-featured social networking experience. Users can transform ideas into stunning visuals using prompts, publish their creations, build their profiles, and interact with other creators in a community built entirely around machine-generated art.

---

## ✨ Key Features

- **🔐 Secure Authentication:** Complete JWT-based login and registration system with Bcrypt password hashing.
- **🎨 AI Image Generation:** Integrated directly with `@google/genai` to turn text prompts into high-quality images.
- **☁️ Cloud Storage:** Secure, permanent storage of AI-generated art and profile pictures using **Cloudinary**.
- **👥 Social Interactions:**
  - Follow and unfollow other creators.
  - Like, unlike, and save posts for later.
  - Browse a dynamic feed of the latest creations and posts from people you follow.
- **👤 User Profiles:** Dedicated profile pages to showcase generated posts and track followers/following.
- **🔔 Notifications System:** Stay updated when users interact with your profile or posts.
- **💳 Credit System:** Built-in credit request capabilities to manage and track AI generation usage.
- **🛠️ Admin Panel:** Dedicated routes for platform management and moderation.

---

## 🛠 Tech Stack

**Frontend (Client-Side)**
- **Framework:** React.js (v19)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit (RTK) & React-Redux
- **Routing:** React Router DOM
- **API Communication:** Axios
- **Icons & Alerts:** Lucide React & React Toastify

**Backend (Server-Side)**
- **Environment:** Node.js
- **Framework:** Express.js (v5)
- **Database:** MongoDB with Mongoose ODM
- **Security:** JSON Web Tokens (JWT) & bcryptjs
- **File Handling:** Multer
- **Cloud/AI:** Cloudinary SDK, Google GenAI SDK

---

## 📂 Project Structure

```text
ImagineX/
├── Client/                 # Frontend React Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── store/          # Redux slices and store configuration
│   │   └── utils/          # Helper functions
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Express Application
│   ├── config/             # DB & Environment configs
│   ├── controllers/        # Route logic and AI integration
│   ├── middleWare/         # Auth & Error handling middlewares
│   ├── models/             # Mongoose DB schemas
│   ├── routes/             # API routes (auth, posts, profile, etc.)
│   └── server.js           # Main application entry point
└── package.json            # Root configuration & scripts
```

---

## 💻 Local Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/inzeela0111/Imaginex.git
cd Imaginex
```

### 2. Install Dependencies
This project uses a unified script to install backend and frontend dependencies simultaneously.
```bash
npm install
npm run build # Installs frontend packages and builds the Client
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google GenAI Setup
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the Application
Start the backend server and frontend development server simultaneously.

**Backend (Root Directory):**
```bash
npm run dev
```

**Frontend (Inside `Client/` Directory):**
```bash
cd Client
npm run dev
```

The app will now be running on `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).

---
<div align="center">
  <i>Built with ❤️ using the MERN Stack and Google GenAI.</i>
</div>
