---
# 🎬 Movie Tracker Web App

A modern movie discovery and tracking web application that allows users to search for movies, manage personal watchlists, mark movies as watched, and view trending movies based on user search activity.

Built with **React**, **Firebase**, and **The Movie Database (TMDB) API**.
---

## 🚀 Features

- 🔍 **Movie Search**
  - Search movies using TMDB API
  - Track search popularity for trending analytics

- ❤️ **Watchlist**
  - Add movies to a personal watchlist
  - Remove movies from watchlist

- ✅ **Watched Movies**
  - Mark movies as watched
  - Move movies between watchlist and watched list

- 📈 **Trending Movies**
  - Displays top searched movies based on user activity
  - Data stored and ranked using Firebase Firestore

- 🔐 **Authentication**
  - User authentication with Firebase Auth
  - Each user has their own private movie lists

---

## 🛠 Tech Stack

### Frontend

- React
- JavaScript (ES6+)
- CSS / Tailwind

### Backend & Services

- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

### External APIs

- The Movie Database (TMDB) API

---

## 📂 Project Structure (Simplified)

src/
├── components/
├── pages/
├── firebase.js
├── App.jsx
└── main.jsx

```

---

## 🔥 Firebase Overview

### Firestore Collections

#### users
{
  "watchlist": ["movieId1", "movieId2"],
  "watched": ["movieId3"]
}
```

#### `metrics`

```json
{
  "searchTerm": "Inception",
  "movie_id": 12345,
  "count": 10,
  "poster_url": "https://...",
  "createdAt": timestamp,
  "updatedAt": timestamp
}

---

## ⚙️ Environment Variables

Create a .env file in the root directory:

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

---

## ▶️ Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/movie-tracker.git
cd movie-tracker

### 2. Install dependencies

npm install

### 3. Run the project

npm run dev

---

## 🌍 Deployment

The project is deployed using Firebase Hosting.

To deploy:

firebase deploy

---

## 🧠 Key Concepts Used

* React hooks (useState, useEffect)
* Firebase Firestore (doc, collection, setDoc, updateDoc)
* Asynchronous programming (async / await)
* Client-side state synchronization
* Environment-based configuration

---

## 📌 Future Improvements

* Movie ratings
* User profiles
* Recommendations based on watched history
* Pagination & infinite scroll
* Improved error handling and loading states

---

## 👨‍💻 Author

Nati Mulugeta
Built as a full-stack learning project using modern web technologies.

---

## 📄 License

This project is licensed under the MIT License.


---

If you want, I can:
- Customize this for **university submission**
- Make a **shorter recruiter-friendly README**
- Add screenshots section
- Rewrite it like a **startup MVP**

Just tell me the vibe 😎
```
