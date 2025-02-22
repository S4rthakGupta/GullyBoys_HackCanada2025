# GullyBoys_HackCanada2025

## Overview
This is our project for **HackCanada 2025**, aimed at building a seamless system for **MediQueue**, streamlining clinic queues with a smart check-in system.

![MediQueue Logo](MediqueueLogoWhite-PNG.png)

---

## Backend Setup & Running Redis on Docker

### 1. Install Docker and Run Redis
Ensure you have **Docker** installed. If not, download and install it from [Docker's official website](https://www.docker.com/).

Once installed, verify it by running:
```sh
docker --version
```

Pull the Redis image:
```sh
docker pull redis
```

Run a Redis container:
```sh
docker run -d -p 6379:6379 --name my-redis redis
```

Check if the Redis container is running:
```sh
docker ps
```
After this, Redis will be accessible at: `redis://localhost:6379`.

---

### 2. Install and Run the Backend
Open a new terminal and navigate to your backend project folder (where `package.json` is located).

#### Navigate to Backend Directory:
```sh
cd backend
```

#### Initialize and Install Dependencies:
```sh
npm init -y
npm install express redis socket.io @clerk/clerk-sdk-node cors dotenv sqlite3
npm install -D nodemon
```

#### Start the Backend Server:
```sh
npm start
```
Your backend should now be running at **http://localhost:8000** (or the port set in your `.env` file).

---

## Frontend Setup

### 3. Install and Run the Frontend
Ensure you have **Node.js** installed. If not, download and install it from [Node.js official website](https://nodejs.org/).

#### Navigate to Frontend Directory:
```sh
cd frontend
```

#### Install Dependencies:
```sh
npm i
```

#### Start the Frontend Development Server:
By default, the frontend will run on **http://localhost:3000**:
```sh
npm run dev
```

---

## Project Structure

```
GULLYBOYS_HACKCANADA2025/
│── backend/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   ├── .env
│── frontend/
│   ├── src/
│   ├── public/
│   ├── next.config.ts
│   ├── package.json
│── Additional-Resources/
│── .gitignore
│── README.md
```

---

## Contributors
- **Sarthak Gupta** - *Front End Developer* (GitHub: (https://github.com/S4rthakGupta))
- **Bibin Tom Joseph** - *Front End Developer* (GitHub:(https://github.com/bibintomj))
- **Dheeraj Chaudhary** - *Back End Developer* (GitHub: (https://github.com/dheeraj3choudhary))
- **Jaiv Barman** - *Back End Developer* (GitHub: (https://github.com/JB250101))

---

## License
This project is licensed under the **MIT License**.
