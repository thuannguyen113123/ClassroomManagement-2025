# Classroom Management

This is a **full-stack** real-time classroom management tool built with:

- Frontend (react)
- Backend (Node.js + Expreess)
- Database (Firebase)
- Real-time chat (Socket.io)
- Twilio (SMS login)

## Project Structure

CLASSROOMMANAGEMENT-2025
├── client
│ ├── node_modules
│ ├── public
│ ├── src
│ │ ├── api
│ │ ├── assets
│ │ ├── components
│ │ │ ├── auth
│ │ │ ├── chat
│ │ │ ├── dashboard
│ │ │ ├── lessons
│ │ │ ├── profile
│ │ │ ├── routes
│ │ │ ├── students
│ │ │ └── ui
│ │ ├── pages
│ │ ├── redux
│ │ │ ├── notification
│ │ │ ├── ui
│ │ │ └── user
│ │ ├── utils
│ │ ├── App.jsx
│ │ ├── firebase.js
│ │ ├── index.css
│ │ ├── main.jsx
│ │ └── các file cấu hình khác
│ └── Screenshots
├── server
│ ├── configs
│ ├── controllers
│ ├── middlewares
│ ├── models
│ ├── node_modules
│ ├── routes
│ ├── index.js
│ └── các file cấu hình khác
├── .gitattributes

## Installation

**1. Clone the repository:**

```Bash
git clone https://github.com/thuannguyen113123/ClassroomManagement-2025
```

**_2.Install dependencies:_**

1. Backend dependencies

```Bash
npm install
```

1. Frontend dependencies

```Bash
cd client
npm install
```

**3. Change a `.env`.example file to `.env`**

1. Backend `.env` in the root directory
2. Frontend `.env` in the client directory

**4. Run the server**

1. Backend server

```
npm start
```

2. Frontend server

```
cd client
npm run dev
```

## Screenshots

![output](/Screenshots/Login.png))
