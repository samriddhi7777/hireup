# 🎯 Hireup - AI-Powered ATS Resume Checker

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node](https://img.shields.io/badge/Node-18.x-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/license-MIT-red)

**Get Your Resume Hireup Ready**  
*The only resume checker that analyzes your GitHub profile, matches with real jobs, and gives you a 25-point ATS checklist — free for students.*

[![GitHub stars](https://img.shields.io/github/stars/samriddhi7777/hireup)](https://github.com/samriddhi7777/hireup/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/samriddhi7777/hireup)](https://github.com/samriddhi7777/hireup/network)

</div>

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [GitHub Integration](#-github-integration)
- [Dashboard Features](#-dashboard-features)
- [PDF Report](#-pdf-report)
- [Project Structure](#-project-structure)
- [Author](#-author)
- [License](#-license)

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🐙 **GitHub Integration** | Import real repositories, languages, and contributions automatically | ✅ Live |
| 📋 **25-Point ATS Checklist** | Comprehensive resume analysis with pass/fail results for each section | ✅ Live |
| 📊 **Job Match Score** | Compare your resume with job descriptions to see match percentage | ✅ Live |
| 🔧 **Skill Gap Analyzer** | Identify missing skills for your target roles with recommendations | ✅ Live |
| 📈 **Dashboard Analytics** | Track your score progress over time with interactive charts | ✅ Live |
| 📥 **PDF Export** | Download professional reports to share with recruiters | ✅ Live |
| 🔐 **Authentication** | Secure login/signup with JWT tokens | ✅ Live |
| ☁️ **Cloud Database** | MongoDB Atlas for reliable data persistence | ✅ Live |

---

## 🛠️ Tech Stack

<div align="center">

| **Frontend** | **Backend** | **Database** | **DevOps** |
|:------------:|:-----------:|:------------:|:----------:|
| React 18 | Node.js 18 | MongoDB Atlas | Git |
| Vite | Express | Mongoose ODM | GitHub |
| Framer Motion | JWT Authentication | | |
| Recharts | REST API | | |
| React Router | Multer | | |
| Axios | PDF Parse | | |
| React Dropzone | Mammoth | | |

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)
- GitHub account (optional)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/samriddhi7777/hireup.git
cd hireup

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Create .env file in server directory
cat > .env << EOF
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
EOF

# 5. Start the backend server
cd ../server
npm run dev

# 6. In a new terminal, start the frontend
cd client
npm run dev
