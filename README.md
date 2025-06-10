# 🎬 Movie Compass

Movie Compass is a sleek, responsive web app that lets users search for movies, browse trending titles, and discover popular films — all powered by the [TMDB API](https://www.themoviedb.org/documentation/api) and Appwrite.

🔗 **Live Demo:** [moviecompass-react19.netlify.app](https://moviecompass-react19.netlify.app/)

---

## 📸 Screenshot

![Screenshot of Movie Compass](https://github.com/OthmanYahya/Movie-Compass/blob/main/Movie%20Compass.png)  

---

## 🚀 Features

- 🔍 **Search Movies:** Look up any movie with real-time search and debounce optimization.
- 📈 **Trending Section:** Displays trending movies using data from your Appwrite backend.
- 🎞️ **Movie Details:** Shows movie title, rating, language, and release year in a modern card UI.
- ⚡ **Fast & Responsive UI:** Built with React and TailwindCSS for smooth performance and mobile-first design.
- ☁️ **Appwrite Integration:** Logs search counts and fetches trending data from Appwrite.

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS
- **APIs:** TMDB API, Appwrite (custom integration)
- **Utilities:** `react-use` (for debounce)

---

## 📂 Project Structure


````.
├── public/
│ ├── hero.png
│ ├── search.svg
│ ├── star.svg
│ ├── no-movie.png
│ └── index.html
├── src/
│ ├── components/
│ │ ├── LoadingIndicator.jsx
│ │ ├── MovieCard.jsx
│ │ └── Search.jsx
│ ├── App.jsx
│ ├── appwrite.js
│ ├── index.css
│ └── main.jsx
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.js
````
