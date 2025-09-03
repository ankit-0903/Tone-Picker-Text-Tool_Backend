# Tone Picker Text Tool - Backend

![Node.js](https://img.shields.io/badge/Node.js-14%2B-brightgreen)
![Express](https://img.shields.io/badge/Express.js-4.x-blue)
![Azure-OpenAI](https://img.shields.io/badge/Azure-OpenAI-blue)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-blue)
![Render](https://img.shields.io/badge/Deploy-Render-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A **Node.js Express backend server** that transforms text into different tones (professional, casual, formal, friendly, etc.) using **Azure OpenAI**.

---
## ✨ Features

* 🎭 **Text Tone Transformation** – Rewrite text in various tones
* 🤖 **Azure OpenAI Integration** – Powered by GPT models
* 🌍 **CORS Enabled** – Ready for frontend integration
* 🛡️ **Input Validation** – Limit text length to 5000 characters
* ❌ **Error Handling** – Meaningful error messages
* 🚀 **Deploy Anywhere** – Vercel, Render, Heroku, AWS Lambda, Docker

---

## 📚 Table of Contents

1. [Quick Start](#-quick-start)
2. [Installation](#-installation)
3. [Environment Setup](#-environment-setup)
4. [Usage](#-usage)
5. [API Endpoints](#-api-endpoints)
6. [Supported Tones](#-supported-tones)
7. [Project Structure](#-project-structure)
8. [Deployment Options](#-deployment-options)
9. [Security Considerations](#-security-considerations)
10. [Contributing](#-contributing)
11. [License](#-license)
12. [Tech Stack](#-tech-stack)

---

## ⚡ Quick Start

```bash
git clone https://github.com/ankit-0903/Tone-Picker-Text-Tool_Backend.git
cd Tone-Picker-Text-Tool_Backend/server
npm install
cp .env.example .env  # Add your Azure API credentials
npm run dev
```

Server will start at `http://localhost:3000`.

---

## 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/ankit-0903/Tone-Picker-Text-Tool_Backend.git
cd Tone-Picker-Text-Tool_Backend
```

2. **Navigate to server directory**

```bash
cd server
```

3. **Install dependencies**

```bash
npm install
```

---

## 🌱 Environment Setup

Create a `.env` file in the `server` folder or use `.env.example`:

```env
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
PORT=3000
```

---

## 🚀 Usage

### Development Mode

```bash
npm run dev
```

Runs with **nodemon** for hot-reloading.

### Production Mode

```bash
npm start
```

---

## 📡 API Endpoints

### POST `/api/transform-tone`

Transforms input text to the specified tone using Azure OpenAI.

**Request Body:**

```json
{
  "text": "Your text to transform",
  "tone": "professional"
}
```

**Response:**

```json
{
  "transformedText": "Your professionally toned text"
}
```

**Error Responses:**

* `400 Bad Request`: Missing fields or text exceeds 5000 characters
* `500 Internal Server Error`: Azure or server-side error

**Example (fetch API):**

```javascript
const response = await fetch('http://localhost:3000/api/transform-tone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "I need help with this task immediately.",
    tone: "polite"
  })
});
const result = await response.json();
console.log(result.transformedText);
```

---

## 🎭 Supported Tones

* Professional
* Casual
* Formal
* Friendly
* Polite
  *(Easily extendable by updating prompt logic)*

---

## 🏗️ Project Structure

```
Tone-Picker-Text-Tool_Backend/
└── server/
    ├── package.json          # Dependencies and scripts
    ├── package-lock.json     # Dependency lock file
    ├── server.js             # Main server logic
    ├── vercel.json           # Vercel deployment config
    ├── .env.example          # Environment variables template
    └── .env                  # Your environment variables (ignored by Git)
```

---

## 🚀 Deployment Options

| Platform       | Steps                                                     |
| -------------- | --------------------------------------------------------- |
| **Vercel**     | Pre-configured. Run `vercel` CLI to deploy.               |
| **Render**     | Connect repo → Auto-detect build → Set env vars → Deploy. |
| **Heroku**     | Push repo → `Procfile` for start command.                 |
| **AWS Lambda** | Use Serverless framework for deployment.                  |
| **Docker**     | Build with `docker build` and run with `docker run`.      |

---

## 🔒 Security Considerations

* 🔑 Use **environment variables** for sensitive data
* 🌐 Restrict **CORS** in production
* 📝 Validate input size (max 5000 chars)
* ⚠️ Error messages avoid exposing internal details

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repo
2. Create a branch:

   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:

   ```bash
   git commit -m 'Add new feature'
   ```
4. Push & create a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🛠️ Tech Stack

* **Node.js** & **Express.js** – Backend framework
* **Azure OpenAI** – Text transformation engine
* **Axios** – API calls
* **CORS** – Cross-origin requests
* **Dotenv** – Environment variables management

---

