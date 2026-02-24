# 🚀 TaskFlow — Student Productivity & Project Hub

TaskFlow is a full-stack productivity platform inspired by tools like Jira and modern habit trackers.  
It helps students organize **projects, tasks, and daily habits** in one clean, powerful system.

Built as a portfolio-grade project to demonstrate **full-stack development, system design, and real product engineering**.

---

## ✨ Key Features

### 🔐 Authentication & Security
- User registration and login (JWT-based)
- Password hashing with bcrypt
- Protected routes & middleware
- Complete data isolation between users

---

### 📁 Projects & Tasks
- Create projects with start & end dates
- Project-scoped tasks
- Task statuses:
  - Pending
  - In Progress
  - Done
- Update task status in real-time
- Delete tasks & projects
- Clean project → task hierarchy

---

### 📅 Habit Tracker System
- Create custom habits (Gym, LeetCode, Study, Reading, etc.)
- Monthly calendar view
- Daily completion tracking
- Visual check-in grid
- Automatic calculations:
  -  Current streak
  -  Best streak
- Month navigation (previous / next / today)

---

### 📊 Productivity Insights
- Monthly habit completion statistics
- Streak consistency metrics
- Habit-level performance overview
- Prepared base for analytics dashboard

---

### 🎨 UI / UX
- Modern dark dashboard design
- Sidebar navigation
- Card-based layout
- Responsive design
- Smooth productivity-focused UI

---

## 🏗️ Tech Stack

### Frontend
- React
- React Router
- Axios
- Custom CSS system

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- bcrypt password hashing

### DevOps / Tooling
- Docker & Docker Compose
- Environment-based configuration
- Modular MVC-style architecture

---

## 📂 Project Structure

```
/project
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       ├── services/
│       ├── components/
│       ├── styles/
│       └── App.js
│
└── docker-compose.yml
```

---

## ▶️ Running the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/KhaledDab/taskflow.git
cd taskflow
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key
```

Run backend server:
```bash
npm start
```

Backend will run at:
```
http://localhost:3001
```

---

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

Frontend will run at:
```
http://localhost:3000
```

---

### 🐳 Run with Docker (Optional)
```bash
docker compose up --build
```

---

## 📸 Screenshots

(Add later for strong CV impact)

---

## 🛣️ Roadmap

-  Analytics dashboard
-  Smart habit insights
-  Reminder system
-  Task labels & priorities
-  Mobile-first layout
-  Team collaboration
-  Heatmaps & charts
-  Cloud deployment

---

## 🧪 Engineering Focus

This project was built to practice and demonstrate:

- Full-stack architecture design
- Secure authentication systems
- REST API engineering
- Database modeling
- State management
- UI system design
- Feature-driven development
- DevOps workflows

---

## 👨‍💻 Author

**Khaled Dabbah**  
Computer Science Student – Bar-Ilan University  

GitHub: https://github.com/KhaledDab  
LinkedIn: https://www.linkedin.com/in/khaled-dabbah-824ba3316/  

---

## ⭐ Why TaskFlow?

TaskFlow is not just a task app.  
It is a productivity platform designed to combine **long-term growth (habits)** with **short-term execution (projects & tasks)**.

This project reflects:
- real product thinking
- scalable system design
- and professional full-stack engineering.
