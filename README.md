# Zeal Brand 👕 

A modern and responsive fashion e-commerce platform built for **Zeal Brand**, an online Sri Lankan clothing brand specializing in premium graphic t-shirts, oversized tees, plain basics, and limited-edition streetwear collections.

The platform transforms the existing manual ordering process through Facebook, Instagram, TikTok, and WhatsApp into a complete digital shopping experience featuring online ordering, inventory management, customer accounts, and an advanced admin dashboard.

![Status](https://img.shields.io/badge/status-active-success)

![License](https://img.shields.io/badge/license-MIT-blue)

![Built With](https://img.shields.io/badge/Built%20With-Next.js%20%7C%20Firebase-orange)

---

# 📖 About the Project

Zeal Brand is a full-stack e-commerce website developed for an online clothing business operating across Sri Lanka.

Previously, customers placed orders through Facebook, Instagram, TikTok, and WhatsApp messages. Every order was handled manually, making inventory management and order tracking difficult.

This project introduces a professional online shopping platform where customers can browse products, select sizes and colors, add items to the shopping cart, place Cash on Delivery (COD) orders, and receive islandwide delivery.

The system also includes a secure Admin Dashboard that allows administrators to manage products, inventory, customer orders, promotions, and website content from one centralized platform.

---

# ✨ Features

## 🛍 Customer Features

- Browse all products
- Search products instantly
- Filter by category
- Filter by size
- Filter by color
- Product detail pages
- Shopping cart
- Cash on Delivery (COD) checkout
- Order confirmation page
- Customer registration & login
- User profile management
- Responsive mobile-first design
- Contact form
- Offers & Sale page
- New Arrivals section

---

## 🔐 Admin Features

- Secure Admin Login
- Dashboard Overview
- Product Management (CRUD)
- Category Management
- Inventory Management
- Order Management
- Customer Management
- Promotion Management
- Staff/User Management
- Firebase Authentication
- Low Stock Monitoring
- Sales Analytics

---

# 👕 Product Categories

- Graphic Tees
- Plain Tees
- Oversized Fit
- Regular Fit
- Limited Edition
- New Arrivals
- Offers & Sale

---

# 📂 Project Structure

```text
Zeal-Brand/
│
├── app/
│
├── components/
│
├── firebase/
│
├── hooks/
│
├── lib/
│
├── public/
│
├── services/
│
├── styles/
│
├── utils/
│
├── .env.local
├── package.json
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

# 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React Framework |
| React.js | Frontend |
| Firebase | Backend Platform |
| Firestore | Cloud Database |
| Firebase Authentication | User Authentication |
| Firebase Storage | Product Images |
| Tailwind CSS | Styling |
| EmailJS | Email Notifications |
| Lucide React | Icons |
| Google Maps | Contact Page |
| Vercel / Firebase Hosting | Deployment |

---

# 🎨 UI Highlights

- Mobile-first responsive design
- Modern streetwear-inspired interface
- Fast browsing experience
- Product image gallery
- SEO optimized pages
- Responsive product grid
- Accessible navigation
- Clean checkout experience

---

# 🔍 Search & Filtering

Customers can quickly find products using:

- Instant Search
- Category Filter
- Size Filter
- Color Filter
- Price Sorting
- Featured Products
- Best Sellers
- New Arrivals
- Offers & Sale

---

# 🚀 Getting Started

## Prerequisites

- Node.js (18+)
- npm
- Git
- Firebase Account

---

## Clone Repository

```bash
git clone https://github.com/yourusername/zeal-brand.git

cd zeal-brand
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

---

## Run Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## Build Production

```bash
npm run build
```

---

## Start Production

```bash
npm start
```

---

# 📱 System Workflow

```text
Customer
      │
      ▼
Visit Website
      │
      ▼
Browse Products
      │
      ▼
Search & Filter
      │
      ▼
View Product Details
      │
      ▼
Select Size & Color
      │
      ▼
Add to Cart
      │
      ▼
Checkout (COD)
      │
      ▼
Order Confirmation
      │
      ▼
Admin Receives Order
      │
      ▼
Inventory Updated
      │
      ▼
Order Processing
```

---

# 🔥 Firebase Collections

| Collection | Description |
|------------|-------------|
| products | Product catalog |
| categories | Product categories |
| orders | Customer orders |
| customers | Customer records |
| promotions | Promotional campaigns |
| adminUsers | Admin accounts |

---

# 👥 User Roles

## Customer

- Browse Products
- Register/Login
- Search Products
- Filter Products
- Add to Cart
- Checkout
- Track Orders
- Manage Profile

---

## Admin

- Dashboard
- Product CRUD
- Inventory Control
- Category Management
- Order Processing
- Customer Management
- Promotions
- Staff Management
- Analytics

---

# 📊 Admin Dashboard

The dashboard provides:

- Dashboard Overview
- Order Management
- Product Management
- Inventory Management
- Customer Management
- Promotion Management
- Analytics
- User Management
- Low Stock Alerts

---

# 📦 Inventory Management

The inventory system automatically:

- Tracks stock by size
- Tracks stock by color
- Updates inventory after every order
- Shows Out of Stock products
- Displays Low Stock alerts
- Allows manual stock updates
- Supports hidden products

---

# 📧 Email Notifications

EmailJS is used for:

- Order Confirmation
- Customer Notifications
- Contact Form
- Admin Notifications

---

# 🚚 Delivery

- Cash on Delivery (COD)
- Islandwide Delivery
- Delivery Date Selection
- Order Notes
- Order Confirmation

---

# 🔐 Security

- Firebase Authentication
- Firestore Security Rules
- Protected Admin Routes
- Role-based Authorization
- Environment Variables

---

# 📈 SEO

- Dynamic Metadata
- Open Graph Tags
- Product Structured Data
- XML Sitemap
- Robots.txt
- Semantic HTML
- Optimized Images

---

# 🎯 Target Audience

- Teenagers
- Young Adults
- Streetwear Enthusiasts
- Fashion Lovers
- Online Shoppers
- Graphic Tee Collectors
- Sri Lankan Clothing Buyers

---

# 📈 Business Benefits

- Eliminates manual WhatsApp ordering
- Faster order processing
- Centralized inventory management
- Better customer experience
- Improved online visibility
- Mobile-friendly shopping
- Supports islandwide delivery

---

# 🔮 Future Enhancements

- Online Payment Gateway
- Wishlist
- Loyalty Rewards
- Customer Reviews
- AI Product Recommendations
- Order Tracking
- Coupon System
- Multi-language Support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📌 Project Status

✔ Research Completed

✔ UI Design

✔ Frontend Development

✔ Firebase Integration

✔ Admin Dashboard

✔ Testing

✔ Deployment

✔ Documentation

---

# 🌍 Live Demo

Production URL

https://your-domain.vercel.app

Development URL

http://localhost:3000

---

# 💖 Brand Vision

> **"Wear your confidence with premium streetwear designed for every style."**

Zeal Brand aims to deliver high-quality fashion through a modern online shopping experience while making stylish clothing accessible to customers across Sri Lanka.

---

# 📄 License

This project was developed for educational and portfolio purposes.

All branding, logos, designs, and business content belong to **Zeal Brand**.

---

# 👩‍💻 Developed By

## Wenuri Sanjana
