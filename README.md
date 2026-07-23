<p align="center">
  <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_logo_wordmark.max-1000x1000.png" alt="Google AI" width="200" />
</p>

# Restaurant Ordering & Management System

A full-stack, modern restaurant ordering system and management dashboard built with Next.js, Tailwind CSS, and Firebase.

## 🚀 Features

### Core Technologies
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (for Shopping Cart)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Google Authentication)

### Key Functionalities Developed
- **Firebase Setup & Integration**: Fully configured Firebase project for real-time data persistence.
- **Google Authentication**: Enabled secure sign-in via Google accounts, creating structured user profiles with `admin` and `customer` roles.
- **Firestore Database Schema & Security**: 
  - Defined rigid, secure collections for `users`, `categories`, `menuItems`, `orders`, `reservations`, and `settings`.
  - Configured robust **Firestore Security Rules** allowing read access for customers and complete CRUD access specifically for admins.
- **Admin Dashboard**:
  - Securely protected route restricted to Admin users.
  - Category Management: Add, edit, delete, and reorder menu categories.
  - Menu Items Management: Add and update menu items linked to categories.
  - Order Management & About Page updates in real-time.
- **Customer Facing Storefront**:
  - Browse menu items by category.
  - Cart management with persistent UI state.
  - Checkout and order tracking features.

## 📦 Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure you have your `.env` configured with your Firebase credentials matching `.env.example`.
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ...etc
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛡️ Security & Deployment
- The `firestore.rules` file contains the exact security requirements for this app's database. This file has been added to `.gitignore` along with the Firebase Applet configuration to prevent exposing sensitive architectural setup variables to public repositories.
- Only the pre-configured admin emails or users designated with the `admin` role in the database can manage the restaurant's operational configuration.
