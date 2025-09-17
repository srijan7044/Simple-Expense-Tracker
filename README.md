# Simple-Expense-Tracker
A simple Expense Tracker for daily life use with user auth.


The file structure 

**EXPENSE-FLOW/

│── backend/                  # Node/Express backend

│   ├── config/               # DB config
|
│   │   └── db.js

│   ├── middleware/           # Custom middleware

│   │   └── auth.js

│   ├── models/               # MongoDB/Mongoose models

│   │   ├── Expense.js

│   │   └── User.js

│   ├── routes/               # API routes

│   │   ├── auth.js

│   │   └── expenses.js

│   ├── server.js             # Entry point for backend

│   └── package.json

│

│── expense/                  # React frontend (Vite)

│   ├── public/               # Static assets

│   │   └── vite.svg

│   ├── src/                  # React source code

│   │   ├── assets/           # Images/icons

│   │   │   └── react.svg

│   │   ├── components/       # UI components

│   │   │   ├── Login.jsx

│   │   │   ├── Register.jsx

│   │   │   ├── ExpenseForm.jsx

│   │   │   ├── ExpenseList.jsx

│   │   │   └── ExpenseItem.jsx

│   │   ├── context/          # Context API

│   │   │   └── AuthContext.jsx

│   │   ├── services/         # API calls

│   │   │   └── api.js

│   │   ├── App.jsx           # Root component

│   │   ├── main.jsx          # Entry file for Vite

│   │   ├── index.css         # Global styles

│   │   └── App.css

│   ├── .env                  # Environment vars (frontend)

│   ├── vite.config.js

│   └── package.json

│── README.md                 # Documentation

**






