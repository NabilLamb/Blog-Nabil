# 📝 Blog-Nabil

A full-stack blogging platform built with **React.js (Vite)** on the frontend and **Express.js** on the backend. Blog-Nabil enables users to read, write, edit, and manage blog posts with secure authentication and rich content formatting.

![Blog-Nabil Screenshot]([./screenshot.png](https://github.com/NabilLamb/Blog-Nabil/blob/41245c1ee76e82b8eed2b62f99006aecea946cd2/scn-blog-app.png))

---

## 🚀 Features

- 🖊️ Rich-text blog post editor with formatting options
- 🔐 JWT-based authentication (login/register)
- 🗃️ MySQL database integration
- 📂 Image upload support via `multer`
- 📅 Friendly dates using `moment.js`
- 🔄 Real-time client routing with React Router
- 🛡️ Secure password hashing with `bcrypt`
- 📦 Environment configuration with `.env`

---

## 🛠️ Technologies Used

### 🧠 Frontend (React - Vite)

| Library              | Description                                 |
|----------------------|---------------------------------------------|
| `react`              | Core UI framework                           |
| `react-dom`          | DOM rendering for React                     |
| `react-router-dom`   | Client-side routing                         |
| `react-icons`        | Icon set for UI enhancements                |
| `moment`             | Date formatting and manipulation            |
| `sass`               | CSS preprocessor for styling                |
| `vite`               | Next-gen build tool and dev server          |
| `eslint`             | Code linting and formatting                 |

### ⚙️ Backend (Express - Node.js)

| Package              | Purpose                                     |
|----------------------|---------------------------------------------|
| `express`            | Web server framework                        |
| `mysql`              | MySQL driver for Node.js                    |
| `dotenv`             | Manage environment variables                |
| `bcrypt`             | Password hashing                            |
| `jsonwebtoken`       | Authentication with JWT                     |
| `cookie-parser`      | Cookie parsing middleware                   |
| `cors`               | Enable CORS support                         |
| `multer`             | File uploading middleware                   |
| `nodemon`            | Live-reloading server during development    |

---

## 📁 Project Structure
Blog-Nabil/
├── client/ # React frontend (Vite)
│ ├── public/
│ ├── src/
│ └── package.json
├── api/ # Express backend
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ └── index.js
│ └── package.json
├── screenshot.png # Application screenshot
└── README.md

---

## ⚙️ Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/yourusername/blog-nabil.git
cd blog-nabil

2. Backend Setup (Express)
cd api
npm install

Create a .env file inside /api with the following example:
PORT=8800
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=blog_nabil
JWT_SECRET=your_jwt_secret

Start the backend server:
npm start

3. Frontend Setup (React - Vite)
cd ../client
npm install
npm run dev

📌 Notes
Ensure your MySQL server is running and the database is properly configured.
Adjust CORS settings if deploying to different domains.
Use secure environment variables for deployment.

👤 Author
Nabil Lambattan

🌐 Connect
GitHub: https://github.com/NabilLamb
LinkedIn: https://www.linkedin.com/in/nabil-lambattan-227961186/


