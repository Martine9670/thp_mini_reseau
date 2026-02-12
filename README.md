A modern, responsive social media application built with a **React** frontend and a **Strapi (Node.js)** backend.

## 🚀 Features
* **User Authentication**: Secure Login and Registration system using JWT.
* **Profile Management**: Users can update their username and bio.
* **Public Profiles**: View other users' profiles and their specific posts.
* **Global Feed**: Real-time display of all posts from the community.
* **Responsive Design**: Styled for both desktop and mobile use.

## 🛠️ Tech Stack
* **Frontend**: React.js, Redux Toolkit, React Router, Vite.
* **Backend**: Strapi CMS (Headless Node.js Framework).
* **Database**: SQLite (Development).
* **Styling**: CSS3.

---

## 📦 Project Structure
```text
social-app/
├── frontend/   # React application (Vite)
└── backend/    # Strapi CMS (API & Database)

⚙️ Setup & Installation
1. Backend (Strapi)

    Go to the backend folder: cd backend

    Install dependencies: npm install

    Start the server: npm run develop The admin panel will be available at http://localhost:1337/admin

2. Frontend (React)

    Go to the frontend folder: cd frontend

    Install dependencies: npm install

    Create a .env file and add: VITE_API_URL=http://localhost:1337

    Start the app: npm run dev The app will be available at http://localhost:5173

📝 License

This project is open source and available under the MIT License.
