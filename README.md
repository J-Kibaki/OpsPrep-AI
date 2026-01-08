# OpsPrep AI 🚀

**OpsPrep AI** is an intelligent interview preparation platform tailored specifically for **DevOps** and **Site Reliability Engineers (SRE)**. Powered by Google's **Gemini 2.5 Flash** model, it helps engineers practice scenario-based questions, analyze job descriptions, and simulate live technical interviews.

![OpsPrep AI Banner](https://via.placeholder.com/1200x600/0f172a/e2e8f0?text=OpsPrep+AI+Dashboard)

## ✨ Features

### 1. 🧠 Scenario Question Generator
- Generate role-specific interview questions (e.g., Senior SRE, Cloud Architect).
- Filter by cloud provider (**AWS, GCP, Azure**) and specific topics (**Kubernetes, Terraform, Observability**).
- Questions focus on "War Room" troubleshooting and architectural design rather than simple definition recall.

### 2. 📚 Deep Answer Guides
- Get structured, senior-level breakdowns for every question.
- **Key Concepts**: Identifies core architectural principles.
- **Timeline View**: Step-by-step ideal answer flow.
- **Code Snippets**: Real-world configuration (Terraform, YAML) and CLI commands.
- **Pro Tips**: Senior engineer insights to stand out.

### 3. 📄 Intelligent Job Parser
- Paste raw job descriptions to extract structured data.
- **Salary Extraction**: Normalizes pay ranges and currency.
- **Skill Mapping**: Maps requirements to a canonical tech taxonomy.
- **Confidence Score**: AI-driven confidence metric for data extraction accuracy.

### 4. 💬 AI Mock Interviewer
- Engage in a real-time chat session with an AI "Principal Engineer".
- The AI probes for deeper understanding ("Why did you choose that approach?").
- Simulate pressure situations in a safe environment.
- **Automated Feedback**: Receive a detailed scorecard with strengths, weaknesses, and actionable tips after every session.

### 5. 👤 Profile & Progress Tracking (New!)
- **Local-First Identity**: Create and edit your engineer profile.
- **Resume Parsing**: Upload your resume (text) to automatically extract skills and seniority level using AI.
- **Readiness Score**: Track your interview preparedness with a dynamic score based on your activity.
- **Gamified Streaks**: Maintain daily learning streaks to build habit consistency.
- **Privacy Focused**: All user data is stored locally in your browser.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
- **State Management**: React Context + LocalStorage (Persistence)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google AI Studio API Key

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
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   # .env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚢 Deployment & Self-Hosting

OpsPrep AI is a static single-page application (SPA). You can host it anywhere that serves static HTML/JS/CSS.

### Option 1: Static Hosting (Vercel, Netlify, S3)

1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the `dist/` folder to your static hosting provider.
3. **Configuration**: Ensure your `API_KEY` is available during the build process if using `.env` injection, or configure your environment to supply it safely.

### Option 2: Docker (Self-Hosting)

You can containerize the app using Nginx to serve the static files.

1. **Create a `Dockerfile`** in the project root:
   ```dockerfile
   # Build Stage
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   # Note: For static builds, env vars are often baked in at build time.
   # Ensure API_KEY is set in your build environment.
   ARG API_KEY
   ENV API_KEY=$API_KEY
   RUN npm run build

   # Serve Stage
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**:
   ```bash
   docker build --build-arg API_KEY=your_key_here -t opsprep-ai .
   docker run -d -p 8080:80 opsprep-ai
   ```
   Access at `http://localhost:8080`.

## 📂 Project Structure

```
/
├── components/       # Reusable UI components
├── context/          # Global state (User, Activity)
├── pages/            # Main application views
├── services/         # Gemini API & LocalStorage logic
├── constants.ts      # Prompt templates and taxonomies
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main router and layout
└── index.tsx         # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This application uses Large Language Models (LLMs) to generate technical content. While the prompts are tuned for accuracy, the AI may occasionally hallucinate commands or facts. Always verify critical configuration snippets with official documentation (AWS, Kubernetes, etc.) before running them in production.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
