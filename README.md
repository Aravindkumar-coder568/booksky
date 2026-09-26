# Booksy - Smart Book Recommendation System
Booksy is a full-stack, beginner-friendly application designed to showcase a modern book discovery platform with a built-in Machine Learning recommendation engine. It demonstrates frontend and backend development, REST APIs, PostgreSQL integration, and a simple Content-Based recommendation algorithm.
## Features
- **Browse & Search:** Explore a catalog of 20+ sample books and filter by genre.
- **Authentication:** Secure user registration and login using JWT.
- **Interactions:** View book details, and "like" or rate books to build your profile.
- **Smart Recommendations:** Get personalized book suggestions based on your interactions using a Python-powered Machine Learning backend.
## Technology Stack
- **Frontend:** React.js (Vite), React Router, Axios, Plain CSS (Light Theme, HCI compliant).
- **Backend:** Node.js, Express.js, JWT, bcrypt.
- **Database:** PostgreSQL.
- **Machine Learning:** Python, Pandas, Scikit-learn (TF-IDF & Cosine Similarity).
## Folder Structure
```text
booksy/
├── frontend/        # React frontend application
├── backend/         # Node.js Express backend
│   ├── controllers/ # API logic
│   ├── db/          # PostgreSQL connection & seed script
│   ├── middleware/  # JWT Auth middleware
│   ├── routes/      # API endpoints
│   └── server.js    # Express server entry point
├── ml/              # Python Machine Learning scripts
│   └── recommend.py # Recommendation algorithm
└── README.md
```
## Setup Instructions
### 1. Database Setup
1. Ensure PostgreSQL is installed and running on your machine.
2. Create a database named `booksy`: `CREATE DATABASE booksy;`
3. Navigate to the `backend` folder and run the seed script to create tables and insert sample books:
   ```bash
   cd backend
   node db/seed.js
   ```
### 2. Backend Setup
1. Inside the `backend` folder, install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   node server.js
   ```
   *The server will run on http://localhost:5000*
### 3. ML Setup
1. Ensure Python 3 is installed.
2. Navigate to the `ml` folder and install required libraries:
   ```bash
   cd ml
   pip install -r requirements.txt
   ```
### 4. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Start the React development server:
   ```bash
   npm run dev
   ```
   *The app will be available at http://localhost:5173*
## How Recommendation Works
The core of Booksy's smart features is a **Content-Based Recommendation System**.
1. **Combine Text:** We take the title, author, genre, and description of a book and combine them into one big text string.
2. **TF-IDF (Term Frequency-Inverse Document Frequency):** This algorithm converts the text into numerical vectors. It gives more weight to unique, meaningful words (like "wizard") and less weight to common words (like "the").
3. **Cosine Similarity:** Once the books are turned into numbers, we calculate the angle (similarity) between them. Books with a smaller angle (higher cosine similarity) are deemed more similar.
4. When you view or like a book, the Node.js backend passes that book's data to the Python script, which finds the most mathematically similar books and returns them to your "My Recommendations" page.

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/books` - Get all books (optional `?genre=`)
- `GET /api/books/:id` - Get specific book details
- `GET /api/books/search` - Search books
- `POST /api/activity` - Log user view/like
- `POST /api/activity/rating` - Rate a book
- `GET /api/recommendations` - Get personalized recommendations (requires Auth)

