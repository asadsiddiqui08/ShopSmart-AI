# 🛍️ ShopSmart AI – AI-Powered E-Commerce Platform

A production-conscious full-stack MERN e-commerce platform integrated with **Google Gemini 2.5 Flash** using the modern `@google/genai` SDK.

---

## 🌟 Highlights & Features

### 🤖 AI Capabilities (Powered by Gemini)
- **Gemini Shopping Assistant**: Real-time floating AI shopping chatbot that queries catalog context, suggests products directly with interactive in-chat "Add to Cart" and "View" cards, answers questions about specs, shipping, discounts, and return policies.
- **Smart Product Recommendations**: Activity-based and context-aware recommendation engine tailored to user behavior.
- **AI Review Sentiment Analysis**: Automatically processes submitted customer reviews, categorizing sentiment (Positive, Neutral, Negative) and generating consensus bullet points.
- **Side-by-Side Product Comparison**: Intelligent multi-product comparison engine that provides an objective verdict, identifies the *Best Value Winner* and *Premium Pick*, and maps out specs.
- **AI Product Description Generator (Admin)**: Allows administrators to input a title, features, and tone of voice to automatically generate compelling e-commerce copy and SEO tags.

### 💻 Frontend Architecture (React + Vite + Tailwind CSS)
- **Completely Independent Frontend** located strictly in `frontend/` with its own `package.json`.
- **Premium Design System**: Crisp white backgrounds, dark slate typography, and purple/indigo accents.
- **Responsive Navbar**: Live search bar with instant autocomplete dropdown, categories, cart badge, wishlist badge, comparison counter, and user profile drawer.
- **Product Catalog & Filters**: Category navigation, price range filtering, brand selector, minimum star rating, and in-stock toggle.
- **Interactive Product Details**: Thumbnail image gallery, technical specifications table, stock indicator, AI key takeaways, and review submission with instant AI sentiment scoring.
- **Shopping Cart & Checkout**: Free shipping progress threshold meter, coupon discounts (e.g. `SMART20` for 20% off), address validation, and simulated payment processing.
- **Customer Wishlist**: Quick save, toggle, and "Move all to cart" actions.
- **Order History & Tracking**: Real-time status badges (`Processing`, `Shipped`, `Delivered`).
- **Admin Dashboard**: Live metrics (Total Revenue, Orders, Products, Registered Users), catalog table, status updates, and AI copy generation modal.

### ⚙️ Backend Architecture (Node.js + Express + MongoDB)
- **Completely Independent Backend** located strictly in `backend/` with its own `package.json`.
- **Modular MVC Architecture**: Separate `config`, `controllers`, `models`, `routes`, `middleware`, `services`, and `utils`.
- **8 Dedicated Mongoose Models**:
  - `User`, `Product`, `Category`, `Cart`, `Order`, `Review`, `ChatHistory`, `UserActivity`
- **Security & Authorization**:
  - Password hashing with `bcryptjs`.
  - JWT token-based authentication with `protect` and `admin` middleware.
  - Server-side validation of stock inventory and price calculations on checkout.
  - Rate limiting on AI endpoints (`express-rate-limit`) to prevent abuse and protect quotas.
  - Zero Gemini API key exposure to frontend clients.
- **Database Connectivity**: Automatic connection to MongoDB Atlas / Local MongoDB, with zero-setup development fallback using `mongodb-memory-server`.

---

## 📂 Project Architecture

```
shopsmart-ai/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   └── ChatWidget.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductComparison.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── products/
│   │   │   └── ai/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── WishlistContext.jsx
│   │   │   └── CompareContext.jsx
│   │   │
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── aiController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── ChatHistory.js
│   │   └── UserActivity.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── aiRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── cloudinaryService.js
│   │   └── recommendationService.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── apiResponse.js
│   │   └── seedData.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or v20+)
- MongoDB Atlas cluster URI or local MongoDB

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure your environment variables in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopsmart_ai
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
Seed the database with sample products and users:
```bash
npm run seed
```
Start backend:
```bash
npm start
# or for hot reloading:
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Configure environment variables in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Accounts (Ready to Test)

The seed script initializes two pre-configured demo accounts. You can also click the quick-fill buttons on the login page:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@shopsmart.ai` | `AdminPassword123!` |
| **Customer** | `alex@shopsmart.ai` | `UserPassword123!` |

**Discount Code**: Enter `SMART20` at cart/checkout for 20% off your purchase.

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register new user |
| `/api/auth/login` | `POST` | Public | Authenticate and obtain JWT |
| `/api/auth/profile` | `GET`, `PUT` | Private | Retrieve / update profile |
| `/api/auth/wishlist` | `GET` | Private | Retrieve saved wishlist |
| `/api/products` | `GET` | Public | Filter, search, paginate catalog |
| `/api/products/:id` | `GET` | Public | Product specs, reviews, & sentiment |
| `/api/products` | `POST` | Admin | Create product |
| `/api/categories` | `GET` | Public | Retrieve categories list |
| `/api/cart` | `GET`, `POST`, `DELETE` | Private | Cart management |
| `/api/orders` | `POST` | Private | Validate & create order |
| `/api/orders/myorders` | `GET` | Private | Retrieve order history |
| `/api/reviews/product/:id`| `POST` | Private | Submit review with AI sentiment analysis |
| `/api/ai/chat` | `POST` | Public | Gemini shopping assistant chatbot |
| `/api/ai/compare` | `POST` | Public | Side-by-side AI product comparison |
| `/api/ai/sentiment` | `POST` | Public | Review sentiment analysis |
| `/api/ai/generate-description` | `POST` | Admin | Gemini product description generator |
| `/api/users/dashboard-stats` | `GET` | Admin | Analytics metrics for dashboard |

---

## 🛡️ Security Best Practices
- Passwords hashed using standard salted bcrypt algorithms.
- JWT verification on all protected endpoints.
- Server-side price calculation to ensure cart values cannot be manipulated by clients.
- Strict rate limiting configured on all AI endpoints.
- Gemini API key strictly isolated within backend environment variables.
