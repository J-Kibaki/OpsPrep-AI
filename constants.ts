import { Taxonomy } from "./types";

export const SKILL_TAXONOMY: Taxonomy = {
  categories: {
    Cloud_Providers: ["AWS", "GCP", "Azure", "Oracle Cloud", "DigitalOcean"],
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
3. Output strictly valid JSON.

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

  ANSWER_GUIDE: `You are a Principal SRE mentoring a candidate. Provide a structured answer guide for the following interview question.

Question: "{question_text}"

Instructions:
1. Provide an "Ideal Answer Outline" in bullet points.
2. Include concrete code snippets or CLI commands (e.g., kubectl, terraform) where applicable.
3. List 2-3 common "Red Flags" or mistakes candidates make.
4. Suggest 1 "Pro-tip" that demonstrates senior-level depth.
5. Return strictly valid JSON.

Output JSON Structure:
{
  "ideal_outline": ["step 1", "step 2", "step 3"],
  "technical_snippets": [
    { "language": "bash|yaml|hcl", "code": "..." }
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
  "extraction_confidence_score": 0.0 to 1.0
}`
};
