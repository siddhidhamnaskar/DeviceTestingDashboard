# DeviceTestingDashboard ⚙️📟

A full-stack IoT dashboard designed to monitor and test device health and connectivity. The project includes a **React.js frontend** built with Material UI and a **Node.js Express backend** with MQTT integration, MySQL database, and WebSocket server.

---

## 🚀 Live Demo
- 🔗 Frontend:[https://device-testing-dashboard.vercel.app/](https://device-testing-dashboard.vercel.app/)
- 🔗 Backend API:[https://devicetestingdashboard.onrender.com/](https://devicetestingdashboard.onrender.com/)

---

## 🛠 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React.js, Material UI (MUI), Emotion, Recharts |
| Backend      | Node.js, Express.js |
| Database     | MySQL + Sequelize |
| Realtime     | MQTT.js, WebSocket |
| Auth         | JWT + Google OAuth |
| Tools        | PM2, Winston, Axios, CORS |

---

## 📁 Folder Structure

```bash
DeviceTestingDashboard/
│
├── frontend/                     # React app
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Tables
│   │   ├── pages/                # Dashboard, Login
│   │   ├── services/             # API wrappers (axios)
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
│
├── backend/                      # Express backend
│   ├── config/                   # DB & MQTT config
│   ├── constants/
│   ├── controllers/
│   ├── database/                 # Sequelize setup
│   ├── middleware/              # JWT auth, CORS, Logger
│   ├── mqtt/                    # MQTT client and handlers
│   ├── routes/
│   ├── utils/
│   ├── websocket/
│   ├── server.js
│   └── .env.example
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend `.env.example`
```env
PORT=9000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
MQTT_HOST=your_mqtt_host
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env.example`
```env
REACT_APP_API_URL=http://localhost:9000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## ▶️ Run Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

---

## 📸 Screenshots
_Add UI screenshots here for dashboard, tables, login page._

---

## 👩‍💻 Developed By

**Siddhi Dhamnaskar**  
💻 Full Stack Developer | IoT Integration | Node.js + React.js  
🔗 [Portfolio](https://siddhi-portfolio.netlify.app) • [GitHub](https://github.com/siddhi-dev) • [LinkedIn](https://linkedin.com/in/siddhi-dhamnaskar)

---

## 📄 License

This project is for personal learning, portfolio, and demonstration purposes.
