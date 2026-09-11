# AIDEAS Website

The official web platform for **AIDEAS PVGCOET**, structured as a monorepo containing both the frontend client and backend server.

---

## 📁 Project Structure

```text
aideas-website-new/
├── frontend/    # Next.js client application
├── backend/     # Node.js / Express API server
└── README.md    # Project documentation

```

---

## 🚀 Getting Started

Follow the steps below to run both the frontend and backend services locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (bundled with Node.js)
* [Git](https://git-scm.com/)

---

### 1. Backend Setup

Open a terminal window and start the backend API:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server
node index.js
# Or with hot-reloading:
node --watch index.js

```

The backend server should now be running on its configured port (e.g., `http://localhost:5000`).

---

### 2. Frontend Setup

Open a **separate/second** terminal window and start the frontend client:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Contribution Guidelines

We follow a **Fork & Pull Request** workflow to ensure code quality and stability.

1. **Fork the Repository:** Click the **Fork** button at the top right of the GitHub page.
2. **Clone your fork locally:**
```bash
git clone [https://github.com/](https://github.com/)<your-username>/aideas-website-new.git
cd aideas-website-new

```


3. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name

```


4. **Commit your changes:**
```bash
git add .
git commit -m "feat: add your feature description"

```


5. **Push to your fork:**
```bash
git push origin feature/your-feature-name

```


6. **Open a Pull Request:** Navigate to the original repository on GitHub, click **Contribute** > **Open Pull Request**, and submit your changes for review.

> **Note:** Direct pushes to the `main` branch are restricted. All changes require PR review and admin approval before merging.

```

```