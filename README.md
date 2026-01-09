# OpsPrep AI 🚀

**OpsPrep AI** is an intelligent interview preparation platform tailored specifically for **DevOps** and **Site Reliability Engineers (SRE)**. Powered by Google's **Gemini** models, it helps engineers practice scenario-based questions, analyze job descriptions, and simulate live technical interviews.

![OpsPrep AI Banner](https://via.placeholder.com/1200x600/0f172a/e2e8f0?text=OpsPrep+AI+Dashboard)

## ✨ Features

### 1. 🧠 Scenario Question Generator
- Generate role-specific interview questions (e.g., Senior SRE, Cloud Architect).
- Filter by cloud provider (**AWS, GCP, Azure**) and specific topics (**Kubernetes, Terraform, Observability**).

### 2. 📚 Deep Answer Guides
- Get structured, senior-level breakdowns for every question.
- **Key Concepts**: Identifies core architectural principles.
- **Code Snippets**: Real-world configuration (Terraform, YAML) and CLI commands.

### 3. 📄 Intelligent Job Parser
- Paste raw job descriptions to extract structured data.
- **Skill Mapping**: Maps requirements to a canonical tech taxonomy.
- **Confidence Score**: AI-driven confidence metric for data extraction accuracy.

### 4. 💬 AI Mock Interviewer
- Engage in a real-time chat session with an AI "Principal Engineer".
- **Automated Feedback**: Receive a detailed scorecard after every session.

### 5. 👤 Profile & Progress Tracking
- **Firebase Persistence**: Secure data storage for profiles and learning history.
- **Resume Parsing**: Upload your resume text to automatically extract skills and seniority level using AI.
- **Readiness Score**: Track your interview preparedness with a dynamic score based on your activity.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database/Auth**: Firebase (Firestore & Auth)
- **AI Model**: Google Gemini 1.5 Flash (via `@google/genai` SDK)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A Google AI Studio API Key
- A Firebase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/opsprep-ai.git
   cd opsprep-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
/
├── components/       # Reusable UI components
├── context/          # Global state (UserContext with Firebase)
├── pages/            # Main application views
├── services/         # Firebase & Gemini API integration
├── constants.ts      # Prompt templates and taxonomies
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main router and layout
└── index.tsx         # Entry point
```

## ⚠️ Disclaimer

This application uses Large Language Models (LLMs) to generate technical content. While the prompts are tuned for accuracy, the AI may occasionally hallucinate commands or facts. Always verify critical configuration snippets with official documentation before running them in production.

## 📄 License

Distributed under the MIT License.
