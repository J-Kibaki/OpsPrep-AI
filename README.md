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

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
- **Build Tooling**: Vite (Recommended for local dev)

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
   *Note: In the live demo environment, the key is injected via `process.env.API_KEY` automatically.*

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
/
├── components/       # Reusable UI components
├── pages/            # Main application views (Home, QuestionBank, JobParser, etc.)
├── services/         # API integration with Google Gemini
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
