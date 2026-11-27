🛍️ ShopSmart AI – AI-Powered E-Commerce Platform

ShopSmart AI is a full-stack MERN e-commerce application integrated with Google Gemini AI to provide an intelligent and interactive online shopping experience.

The platform combines traditional e-commerce functionality with AI-powered shopping assistance, allowing users to explore products, get product recommendations, and interact with an AI shopping assistant.

🌐 Live Demo

- Frontend: https://shopsmart-ai-frontend-hd4o.onrender.com 
- Backend API: https://shopsmart-ai-5bvi.onrender.com/api
- GitHub Repository: https://github.com/asadsiddiqui08/ShopSmart-AI

✨ Key Features

🤖 AI Shopping Assistant

- Integrated with Google Gemini API.
- Interactive AI shopping chatbot.
- Product suggestions based on catalog context.
- AI-based product comparison.
- Answers questions about product specifications, shipping, discounts, and return policies.
- Interactive product cards with Add to Cart and View options.

🛒 E-Commerce Features

- Browse and explore products.
- Product details and product information.
- Add products to shopping cart.
- User login and authentication.
- Shopping experience with a responsive interface.

👤 User Features

- User authentication using JWT.
- Secure password handling.
- Personalized shopping experience.

⚙️ Admin Features

- Admin dashboard and management functionality, where enabled.
- Product and order management for authorized administrators.


## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI Integration | Google Gemini API |
| Authentication | JSON Web Token (JWT) |
| Image Management | Cloudinary |
| API Requests | Axios |
| Deployment | Render |
| Version Control | Git, GitHub |



## 📁 Project Structure

```text
ShopSmart-AI/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```



🚀 Installation & Setup


### 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/asadsiddiqui08/ShopSmart-AI.git
cd ShopSmart-AI
```


### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm start
```


### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```



Open the local URL displayed in your terminal.

☁️ Deployment

The application is deployed using Render.

- Backend: Render Web Service
- Frontend: Render Static Site
- Database: MongoDB Atlas
- Image Storage: Cloudinary
- AI Integration: Google Gemini API

🔐 Environment Variables & Security

- API keys and database credentials are stored in environment variables.
- Never upload ".env" files or private API keys to GitHub.
- Backend API routes should enforce authentication and role-based authorization.
- Keep administrator credentials private.

🎯 Project Objective

The objective of ShopSmart AI is to combine modern full-stack web development with Artificial Intelligence to create a smarter, more interactive, and user-friendly e-commerce platform.

👨‍💻 Developer

Asad Ahmad Siddiqui

B.Tech – Computer Science & Engineering

GitHub: https://github.com/asadsiddiqui08

---

⭐ If you find this project interesting, consider giving it a star on GitHub!
