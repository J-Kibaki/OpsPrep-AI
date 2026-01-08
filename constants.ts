import { Taxonomy } from "./types";

export const SKILL_TAXONOMY: Taxonomy = {
  categories: {
    Cloud_Providers: ["AWS", "GCP", "Azure", "Oracle Cloud", "DigitalOcean"],
    Operating_Systems: ["Linux", "Red Hat", "Ubuntu", "CentOS", "Windows Server"],
    Containerization: ["Kubernetes", "Docker", "Helm", "Istio", "Containerd", "OpenShift"],
    IaC_and_Config: ["Terraform", "Ansible", "CloudFormation", "Pulumi", "SaltStack"],
    CI_CD: ["Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "ArgoCD", "Tekton"],
    Observability: ["Prometheus", "Grafana", "Datadog", "New Relic", "Splunk", "ELK Stack", "OpenTelemetry"],
    Scripting: ["Python", "Bash", "Go", "Rust", "PowerShell"],
    Networking: ["DNS", "BGP", "TCP/IP", "Load Balancing", "Nginx", "HAProxy", "VPC"],
    Databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "DynamoDB"],
    Security: ["IAM", "Vault", "OIDC", "WAF", "Zero Trust", "Trivy"],
    SRE_Concepts: ["SLO/SLA", "Error Budgets", "Chaos Engineering", "Incident Command", "Postmortems"]
  }
};

export const PROMPTS = {
  QUESTION_GENERATOR: `You are an expert Technical Interviewer for DevOps and SRE roles.
Task: Generate {count} interview questions for a {seniority} level role.
The specific focus topics are: {topics}.
The target cloud provider is: {cloud_provider}.

Constraints:
1. Questions must be scenario-based, not just definition recall (e.g., "A deployment failed..." vs "What is a pod?").
2. Include at least one "War Room" style troubleshooting question.
3. Ensure questions cover both architectural decision-making and low-level debugging (e.g. Linux syscalls, network packets) where appropriate.
4. Output strictly valid JSON.

Output JSON Structure (Array):
[
  {
    "id": "uuid",
    "role": "{role}",
    "level": "{seniority}",
    "topic_tags": ["tag1", "tag2"],
    "question_text": "string",
    "difficulty": "Easy" | "Medium" | "Hard",
    "time_estimate_minutes": number
  }
]`,

  ANSWER_GUIDE: `You are a Principal SRE mentoring a candidate. Provide a deep, structured answer guide for the following interview question.

Question: "{question_text}"

Instructions:
1. IDENTIFY 3-5 "Key Concepts" (e.g., "Idempotency", "Control Loop", "Event Consistency") required to answer.
2. Provide a "Step-by-Step Ideal Answer" focusing on the architectural 'Why' and the operational 'How'.
3. Include realistic code snippets (kubectl, terraform, promql) with brief captions.
4. List common "Red Flags" (shallow answers) and a "Pro-Tip" (senior insight).
5. Return strictly valid JSON.

Output JSON Structure:
{
  "key_concepts": ["concept1", "concept2"],
  "ideal_outline": ["step 1", "step 2", "step 3"],
  "technical_snippets": [
    { "language": "bash|yaml|hcl|python", "code": "...", "caption": "Brief description" }
  ],
  "common_mistakes": ["mistake 1", "mistake 2"],
  "pro_tip": "string",
  "follow_up_questions": ["question 1", "question 2"]
}`,

  JOB_PARSER: `You are a Data Extraction Specialist. Extract structured data from the following raw job posting text.

Taxonomy Rules:
- Map extracted skills strictly to standard canonical names (e.g., "K8s" -> "Kubernetes", "GCP" -> "Google Cloud Platform").
- If a salary range is found, extract min, max, and currency. If only one number, set min=max.
- Determine if the role is Remote, Hybrid, or Onsite.
- Extract lists of specific responsibilities and technical requirements.

Raw Text:
"{raw_job_text}"

Output JSON Structure:
{
  "job_title": "string",
  "company_name": "string",
  "location_raw": "string",
  "work_mode": "Remote" | "Hybrid" | "Onsite" | "Unknown",
  "seniority_level": "Entry" | "Mid" | "Senior" | "Principal" | "Unknown",
  "salary": {
    "min": number | null,
    "max": number | null,
    "currency": "string"
  },
  "required_skills": ["string"],
  "responsibilities": ["string"],
  "requirements": ["string"],
  "benefits": ["string"],
  "extraction_confidence_score": 0.0 to 1.0
}`,

  CHEAT_SHEET_GENERATOR: `You are a Technical Documentation Expert.
Task: Create a concise, high-value Cheat Sheet for the topic: "{topic}".
Focus: Real-world, practical commands and patterns used by DevOps engineers in production.

Constraints:
1. Include a brief 1-sentence introduction.
2. Group items into 3-5 logical sections (e.g., "Debugging", "Configuration", "Networking").
3. Each item must have a specific command/pattern and a short description.
4. Output strictly valid JSON.

Output JSON Structure:
{
  "topic": "{topic}",
  "introduction": "string",
  "sections": [
    {
      "title": "string",
      "items": [
        { "command": "string", "description": "string" }
      ]
    }
  ]
}`
};