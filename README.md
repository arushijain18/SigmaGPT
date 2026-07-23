SigmaGPT
An AI-powered chat platform — sign up, chat, and get instant AI responses in a sleek, ChatGPT-style interface.
Overview
SigmaGPT is a full-stack AI chatbot application that pairs secure user authentication with fast, real-time conversations. Built on a React frontend and an Express/MongoDB backend, it connects to Groq's LLM API for near-instant responses, all wrapped in a clean, minimal, dark-themed interface.
Features
AI-Powered Chat — Real-time conversations powered by Groq's OpenAI-compatible API.
Secure Authentication — User sign-up and login with Passport.js.
Persistent Chat History — Conversations are saved and can be retrieved anytime.
Clean & Responsive UI — Modern ChatGPT-inspired interface built with React.
Fast & Lightweight — Vite-powered frontend for fast loading.
Cross-Origin Ready — Secure frontend-backend communication using CORS.
Tech Stack
Category	Technologies
Frontend	React · Vite · JavaScript
Backend	Node.js · Express.js
Database	MongoDB · Mongoose
Authentication	Passport.js
AI Engine	Groq API (OpenAI-Compatible)
Deployment	Render
Getting Started
Prerequisites
Node.js v18+
MongoDB (Local or Atlas)
Groq API Key
Installation
Clone the repository:
git clone https://github.com/arushijain18/SigmaGPT.git
cd SigmaGPT
Install backend dependencies:
cd Backend
npm install
Install frontend dependencies:
cd ../Frontend
npm install
Environment Variables
Create a .env file inside the Backend folder.
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=8080
Create a .env file inside the Frontend folder.
VITE_API_URL=http://localhost:8080
Run the Project
Start the backend:
cd Backend
node server.js
Start the frontend:
cd Frontend
npm run dev
Backend: http://localhost:8080
Frontend: http://localhost:5173
Project Structure
├── Backend/
│   ├── config/          # Passport & Authentication Config
│   ├── routes/          # Express Routes (Auth & Chat)
│   ├── server.js        # Backend Entry Point
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── Auth.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ChatWindow.jsx
│   │   └── App.jsx
│   └── .env
│
└── README.md
Deployment
Hosted on Render — backend and frontend are deployed independently and automatically redeploy on every push to the main branch.
Live Demo:
https://sigmagpt-frontend-53bq.onrender.com
Author
Made by Arushi Jain
