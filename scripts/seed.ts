#!/usr/bin/env node
/**
 * CareerGraph Database Seed Script
 * 
 * Creates constraints, nodes and relationships in CognoDB.
 * Run: npm run db:seed
 * 
 * Seeded data:
 *   25 People
 *   35 Skills
 *   20 Projects
 *   15 Roles
 *   10 Companies
 *   20 Learning Resources
 *   300+ Relationships
 */

import neo4j, { Session, ManagedTransaction } from "neo4j-driver";
import { config } from "dotenv";

config({ path: ".env" });

const URI = process.env.NEO4J_URI!;
const USERNAME = process.env.NEO4J_USERNAME ?? "cognodb";
const PASSWORD = process.env.NEO4J_PASSWORD!;
const DATABASE = process.env.NEO4J_DATABASE ?? "neo4j";

if (!URI || !PASSWORD) {
  console.error("❌ Missing NEO4J_URI or NEO4J_PASSWORD in environment");
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

async function run(session: Session, cypher: string, params: Record<string, unknown> = {}) {
  return session.executeWrite((tx: ManagedTransaction) => tx.run(cypher, params));
}

// ============================================
// CONSTRAINTS
// ============================================

async function createConstraints(session: Session) {
  console.log("📐 Creating constraints...");
  const constraints = [
    "CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE",
    "CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT role_id IF NOT EXISTS FOR (r:Role) REQUIRE r.id IS UNIQUE",
    "CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE",
    "CREATE CONSTRAINT resource_id IF NOT EXISTS FOR (lr:LearningResource) REQUIRE lr.id IS UNIQUE",
  ];

  for (const c of constraints) {
    try {
      await run(session, c);
    } catch {
      // Constraint may already exist; that's fine
    }
  }
}

// ============================================
// SKILLS (35)
// ============================================

const skills = [
  // Frontend
  { id: "skill:javascript", name: "JavaScript", category: "Frontend", difficulty: "Intermediate", description: "Core web scripting language" },
  { id: "skill:typescript", name: "TypeScript", category: "Frontend", difficulty: "Intermediate", description: "Typed superset of JavaScript" },
  { id: "skill:react", name: "React", category: "Frontend", difficulty: "Intermediate", description: "UI component library by Meta" },
  { id: "skill:nextjs", name: "Next.js", category: "Frontend", difficulty: "Advanced", description: "React framework for production" },
  { id: "skill:vue", name: "Vue.js", category: "Frontend", difficulty: "Intermediate", description: "Progressive JavaScript framework" },
  { id: "skill:css", name: "CSS/Tailwind", category: "Frontend", difficulty: "Beginner", description: "Styling and layout for web" },
  { id: "skill:graphql", name: "GraphQL", category: "Frontend", difficulty: "Advanced", description: "API query language" },
  // Backend
  { id: "skill:nodejs", name: "Node.js", category: "Backend", difficulty: "Intermediate", description: "JavaScript runtime for backend" },
  { id: "skill:python", name: "Python", category: "Backend", difficulty: "Intermediate", description: "General-purpose programming language" },
  { id: "skill:fastapi", name: "FastAPI", category: "Backend", difficulty: "Intermediate", description: "Modern Python web framework" },
  { id: "skill:express", name: "Express.js", category: "Backend", difficulty: "Intermediate", description: "Minimal Node.js web framework" },
  { id: "skill:go", name: "Go", category: "Backend", difficulty: "Advanced", description: "Statically typed compiled language" },
  { id: "skill:rust", name: "Rust", category: "Backend", difficulty: "Expert", description: "Systems programming language" },
  // Database
  { id: "skill:postgresql", name: "PostgreSQL", category: "Database", difficulty: "Intermediate", description: "Advanced open-source SQL database" },
  { id: "skill:mongodb", name: "MongoDB", category: "Database", difficulty: "Intermediate", description: "Document-oriented NoSQL database" },
  { id: "skill:neo4j", name: "Neo4j / CognoDB", category: "Database", difficulty: "Advanced", description: "Graph database with Cypher query language" },
  { id: "skill:redis", name: "Redis", category: "Database", difficulty: "Intermediate", description: "In-memory data structure store" },
  // DevOps
  { id: "skill:docker", name: "Docker", category: "DevOps", difficulty: "Intermediate", description: "Containerization platform" },
  { id: "skill:kubernetes", name: "Kubernetes", category: "DevOps", difficulty: "Advanced", description: "Container orchestration system" },
  { id: "skill:cicd", name: "CI/CD", category: "DevOps", difficulty: "Intermediate", description: "Continuous integration and delivery" },
  { id: "skill:linux", name: "Linux / Bash", category: "DevOps", difficulty: "Intermediate", description: "Unix-based OS and shell scripting" },
  // Cloud
  { id: "skill:aws", name: "AWS", category: "Cloud", difficulty: "Advanced", description: "Amazon Web Services cloud platform" },
  { id: "skill:gcp", name: "Google Cloud", category: "Cloud", difficulty: "Advanced", description: "Google Cloud Platform" },
  { id: "skill:azure", name: "Azure", category: "Cloud", difficulty: "Advanced", description: "Microsoft cloud platform" },
  // AI/ML
  { id: "skill:ml", name: "Machine Learning", category: "AI/ML", difficulty: "Advanced", description: "Statistical learning algorithms" },
  { id: "skill:llm", name: "LLMs / Prompt Engineering", category: "AI/ML", difficulty: "Intermediate", description: "Large language model integration" },
  { id: "skill:rag", name: "RAG Pipelines", category: "AI/ML", difficulty: "Advanced", description: "Retrieval augmented generation" },
  { id: "skill:langchain", name: "LangChain", category: "AI/ML", difficulty: "Intermediate", description: "LLM application framework" },
  { id: "skill:pytorch", name: "PyTorch", category: "AI/ML", difficulty: "Advanced", description: "Deep learning framework" },
  // Data
  { id: "skill:spark", name: "Apache Spark", category: "Data Engineering", difficulty: "Advanced", description: "Large-scale data processing" },
  { id: "skill:kafka", name: "Apache Kafka", category: "Data Engineering", difficulty: "Advanced", description: "Distributed event streaming" },
  { id: "skill:dbt", name: "dbt", category: "Data Engineering", difficulty: "Intermediate", description: "Data build tool for transformations" },
  // Architecture
  { id: "skill:systemdesign", name: "System Design", category: "Architecture", difficulty: "Expert", description: "Designing scalable distributed systems" },
  { id: "skill:microservices", name: "Microservices", category: "Architecture", difficulty: "Advanced", description: "Microservice architecture patterns" },
  { id: "skill:testing", name: "Testing / TDD", category: "Testing", difficulty: "Intermediate", description: "Unit, integration, and e2e testing" },
];

// ============================================
// LEARNING RESOURCES (20)
// ============================================

const resources = [
  { id: "res:ts-handbook", title: "TypeScript Handbook", type: "Documentation", url: "https://www.typescriptlang.org/docs/", provider: "Microsoft", difficulty: "Intermediate" },
  { id: "res:react-docs", title: "React Official Docs", type: "Documentation", url: "https://react.dev", provider: "Meta", difficulty: "Beginner" },
  { id: "res:nextjs-learn", title: "Next.js Learn", type: "Tutorial", url: "https://nextjs.org/learn", provider: "Vercel", difficulty: "Intermediate" },
  { id: "res:node-course", title: "Node.js Complete Guide", type: "Course", url: "https://www.udemy.com/course/nodejs-the-complete-guide/", provider: "Udemy", difficulty: "Intermediate" },
  { id: "res:docker-guide", title: "Docker Deep Dive", type: "Book", url: "https://www.amazon.com/Docker-Deep-Dive-Nigel-Poulton/dp/1916585256", provider: "Nigel Poulton", difficulty: "Intermediate" },
  { id: "res:aws-practitioner", title: "AWS Cloud Practitioner", type: "Course", url: "https://aws.amazon.com/certification/", provider: "AWS", difficulty: "Beginner" },
  { id: "res:aws-developer", title: "AWS Developer Associate", type: "Course", url: "https://aws.amazon.com/certification/certified-developer-associate/", provider: "AWS", difficulty: "Advanced" },
  { id: "res:ml-course", title: "Machine Learning Specialization", type: "Course", url: "https://www.coursera.org/specializations/machine-learning-introduction", provider: "Coursera / Andrew Ng", difficulty: "Intermediate" },
  { id: "res:system-design", title: "System Design Interview", type: "Book", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF", provider: "Alex Xu", difficulty: "Advanced" },
  { id: "res:python-fluent", title: "Fluent Python", type: "Book", url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/", provider: "O'Reilly", difficulty: "Advanced" },
  { id: "res:k8s-course", title: "Kubernetes for Beginners", type: "Course", url: "https://www.udemy.com/course/learn-kubernetes/", provider: "Udemy", difficulty: "Intermediate" },
  { id: "res:graphql-how-to", title: "How to GraphQL", type: "Tutorial", url: "https://www.howtographql.com/", provider: "Prisma", difficulty: "Intermediate" },
  { id: "res:langchain-docs", title: "LangChain Documentation", type: "Documentation", url: "https://docs.langchain.com/", provider: "LangChain", difficulty: "Intermediate" },
  { id: "res:pytorch-tutorial", title: "PyTorch Tutorials", type: "Tutorial", url: "https://pytorch.org/tutorials/", provider: "PyTorch", difficulty: "Advanced" },
  { id: "res:kafka-definitive", title: "Kafka: The Definitive Guide", type: "Book", url: "https://www.confluent.io/resources/kafka-the-definitive-guide-v2/", provider: "Confluent", difficulty: "Advanced" },
  { id: "res:neo4j-fundamentals", title: "Neo4j Graph Academy", type: "Course", url: "https://graphacademy.neo4j.com/", provider: "Neo4j", difficulty: "Beginner" },
  { id: "res:go-tour", title: "A Tour of Go", type: "Tutorial", url: "https://go.dev/tour/", provider: "Google", difficulty: "Intermediate" },
  { id: "res:postgres-tutorial", title: "PostgreSQL Tutorial", type: "Tutorial", url: "https://www.postgresqltutorial.com/", provider: "PostgreSQL Tutorial", difficulty: "Beginner" },
  { id: "res:rag-guide", title: "Building RAG Applications", type: "Course", url: "https://www.deeplearning.ai/short-courses/building-applications-vector-databases/", provider: "DeepLearning.AI", difficulty: "Advanced" },
  { id: "res:fastapi-docs", title: "FastAPI Documentation", type: "Documentation", url: "https://fastapi.tiangolo.com/", provider: "Sebastián Ramírez", difficulty: "Intermediate" },
];

// ============================================
// COMPANIES (10)
// ============================================

const companies = [
  { id: "company:wexa-ai", name: "Wexa AI", industry: "Artificial Intelligence", location: "San Francisco, CA", website: "https://wexa.ai" },
  { id: "company:vercel", name: "Vercel", industry: "Developer Tools", location: "Remote / San Francisco", website: "https://vercel.com" },
  { id: "company:stripe", name: "Stripe", industry: "FinTech", location: "San Francisco, CA", website: "https://stripe.com" },
  { id: "company:databricks", name: "Databricks", industry: "Data & AI", location: "San Francisco, CA", website: "https://databricks.com" },
  { id: "company:linear", name: "Linear", industry: "Developer Tools", location: "Remote", website: "https://linear.app" },
  { id: "company:notion", name: "Notion", industry: "Productivity", location: "San Francisco, CA", website: "https://notion.so" },
  { id: "company:shopify", name: "Shopify", industry: "eCommerce", location: "Ottawa, Canada", website: "https://shopify.com" },
  { id: "company:cloudflare", name: "Cloudflare", industry: "Cloud Infrastructure", location: "San Francisco, CA", website: "https://cloudflare.com" },
  { id: "company:hugging-face", name: "Hugging Face", industry: "AI / Open Source", location: "New York, NY", website: "https://huggingface.co" },
  { id: "company:planetscale", name: "PlanetScale", industry: "Database / Developer Tools", location: "San Francisco, CA", website: "https://planetscale.com" },
];

// ============================================
// ROLES (15)
// ============================================

const roles = [
  { id: "role:frontend-engineer", title: "Frontend Engineer", description: "Build modern web UIs", level: "Mid", salaryRange: "$120K–$160K" },
  { id: "role:backend-engineer", title: "Backend Engineer", description: "Design and build scalable APIs", level: "Mid", salaryRange: "$130K–$170K" },
  { id: "role:fullstack-engineer", title: "Full Stack Engineer", description: "Own features end-to-end", level: "Mid", salaryRange: "$130K–$175K" },
  { id: "role:senior-fullstack", title: "Senior Full Stack Engineer", description: "Lead feature teams", level: "Senior", salaryRange: "$160K–$210K" },
  { id: "role:ai-engineer", title: "AI Engineer", description: "Build LLM-powered products", level: "Mid", salaryRange: "$150K–$200K" },
  { id: "role:ml-engineer", title: "ML Engineer", description: "Train and deploy ML models", level: "Senior", salaryRange: "$170K–$230K" },
  { id: "role:devops-engineer", title: "DevOps / Platform Engineer", description: "Build developer infrastructure", level: "Senior", salaryRange: "$150K–$200K" },
  { id: "role:cloud-engineer", title: "Cloud Engineer", description: "Design cloud-native systems", level: "Senior", salaryRange: "$155K–$205K" },
  { id: "role:data-engineer", title: "Data Engineer", description: "Build data pipelines and warehouses", level: "Mid", salaryRange: "$140K–$185K" },
  { id: "role:software-engineer", title: "Software Engineer", description: "Generalist engineering role", level: "Mid", salaryRange: "$125K–$165K" },
  { id: "role:staff-engineer", title: "Staff Engineer", description: "Cross-team technical leadership", level: "Staff", salaryRange: "$220K–$300K" },
  { id: "role:principal-engineer", title: "Principal Engineer", description: "Org-wide technical vision", level: "Principal", salaryRange: "$260K–$350K" },
  { id: "role:lead-engineer", title: "Engineering Lead", description: "Team tech lead and mentor", level: "Lead", salaryRange: "$185K–$240K" },
  { id: "role:junior-engineer", title: "Junior Software Engineer", description: "Entry-level engineering position", level: "Junior", salaryRange: "$80K–$115K" },
  { id: "role:graph-engineer", title: "Graph Database Engineer", description: "Design and build graph database systems", level: "Senior", salaryRange: "$165K–$215K" },
];

// ============================================
// PROJECTS (20)
// ============================================

const projects = [
  { id: "proj:careergraph", name: "CareerGraph", description: "Interactive career and skill knowledge graph", category: "SaaS", githubUrl: "https://github.com/santosh-patel/careergraph", year: 2024 },
  { id: "proj:food-donation", name: "Food Donation Platform", description: "Connects food donors with local shelters", category: "Social Impact", githubUrl: "https://github.com/santosh-patel/food-donation", year: 2023 },
  { id: "proj:hotel-booking", name: "Hotel Booking Platform", description: "Full-stack hotel reservation system", category: "Travel", year: 2023 },
  { id: "proj:blog-platform", name: "Blog Platform", description: "Multi-author blog with CMS", category: "Content", githubUrl: "https://github.com/santosh-patel/blog-platform", year: 2022 },
  { id: "proj:ecommerce-api", name: "eCommerce API", description: "REST + GraphQL e-commerce backend", category: "Commerce", year: 2023 },
  { id: "proj:data-pipeline", name: "ETL Data Pipeline", description: "Real-time Kafka-to-warehouse pipeline", category: "Data", year: 2024 },
  { id: "proj:ml-classifier", name: "Document Classifier", description: "ML-based document classification model", category: "AI", year: 2023 },
  { id: "proj:chat-app", name: "Real-time Chat App", description: "WebSocket-based chat with rooms", category: "Social", year: 2022 },
  { id: "proj:auth-service", name: "Auth Microservice", description: "JWT/OAuth2 authentication service", category: "Security", year: 2023 },
  { id: "proj:monitoring-dashboard", name: "Monitoring Dashboard", description: "Infrastructure metrics visualization", category: "DevOps", year: 2024 },
  { id: "proj:rag-assistant", name: "RAG Documentation Assistant", description: "LLM assistant with RAG over company docs", category: "AI", year: 2024 },
  { id: "proj:graph-analytics", name: "Graph Analytics Platform", description: "Social network analysis with Neo4j", category: "Analytics", year: 2024 },
  { id: "proj:portfolio-site", name: "Developer Portfolio", description: "Animated developer portfolio website", category: "Web", year: 2022 },
  { id: "proj:kubernetes-platform", name: "Internal Developer Platform", description: "Self-service K8s deployment portal", category: "DevOps", year: 2024 },
  { id: "proj:price-predictor", name: "ML Price Predictor", description: "Real estate price prediction model", category: "AI", year: 2023 },
  { id: "proj:api-gateway", name: "API Gateway Service", description: "Rate-limiting and routing gateway in Go", category: "Infrastructure", year: 2024 },
  { id: "proj:search-engine", name: "Full-text Search Engine", description: "Elasticsearch-based product search", category: "Search", year: 2023 },
  { id: "proj:notification-service", name: "Notification Service", description: "Multi-channel notification microservice", category: "Infrastructure", year: 2023 },
  { id: "proj:design-system", name: "UI Design System", description: "Component library and design tokens", category: "Frontend", year: 2022 },
  { id: "proj:analytics-sdk", name: "Analytics SDK", description: "Event tracking and analytics SDK", category: "Analytics", year: 2023 },
];

// ============================================
// PEOPLE (25)
// ============================================

const people = [
  { id: "person:santosh-patel", name: "Santosh Patel", email: "santosh@example.com", title: "Full Stack Engineer", location: "Mumbai, India", experienceYears: 4, bio: "Passionate full-stack engineer building products with React, Next.js, Node.js and graph databases. Currently exploring AI/ML integration.", createdAt: "2024-01-15" },
  { id: "person:priya-sharma", name: "Priya Sharma", email: "priya@example.com", title: "Frontend Engineer", location: "Bangalore, India", experienceYears: 3, bio: "Frontend specialist with deep expertise in React and TypeScript. Loves building performant UI.", createdAt: "2024-01-16" },
  { id: "person:arjun-mehta", name: "Arjun Mehta", email: "arjun@example.com", title: "AI Engineer", location: "Hyderabad, India", experienceYears: 5, bio: "AI engineer specializing in LLM integration, RAG pipelines, and production ML systems.", createdAt: "2024-01-17" },
  { id: "person:elena-volkov", name: "Elena Volkov", email: "elena@example.com", title: "Data Engineer", location: "Berlin, Germany", experienceYears: 6, bio: "Data engineer building large-scale pipelines with Kafka, Spark and dbt.", createdAt: "2024-01-18" },
  { id: "person:james-okafor", name: "James Okafor", email: "james@example.com", title: "DevOps Engineer", location: "Lagos, Nigeria", experienceYears: 7, bio: "Platform engineer with expertise in Kubernetes, Terraform, and AWS.", createdAt: "2024-01-19" },
  { id: "person:sarah-chen", name: "Sarah Chen", email: "sarah@example.com", title: "ML Engineer", location: "Toronto, Canada", experienceYears: 5, bio: "ML engineer specializing in PyTorch, model training, and MLOps.", createdAt: "2024-01-20" },
  { id: "person:miguel-santos", name: "Miguel Santos", email: "miguel@example.com", title: "Backend Engineer", location: "São Paulo, Brazil", experienceYears: 4, bio: "Backend engineer building high-performance APIs with Go and PostgreSQL.", createdAt: "2024-01-21" },
  { id: "person:aisha-al-rashid", name: "Aisha Al-Rashid", email: "aisha@example.com", title: "Cloud Engineer", location: "Dubai, UAE", experienceYears: 5, bio: "Cloud architect with expertise in AWS, Kubernetes, and multi-cloud strategies.", createdAt: "2024-01-22" },
  { id: "person:liam-kelly", name: "Liam Kelly", email: "liam@example.com", title: "Full Stack Engineer", location: "Dublin, Ireland", experienceYears: 3, bio: "Full-stack engineer focused on React, Node.js and Postgres. Building SaaS products.", createdAt: "2024-01-23" },
  { id: "person:yuki-tanaka", name: "Yuki Tanaka", email: "yuki@example.com", title: "Senior Software Engineer", location: "Tokyo, Japan", experienceYears: 8, bio: "Senior engineer with experience across frontend, backend and distributed systems.", createdAt: "2024-01-24" },
  { id: "person:amara-diallo", name: "Amara Diallo", email: "amara@example.com", title: "Graph Database Engineer", location: "Paris, France", experienceYears: 6, bio: "Specialist in Neo4j, CognoDB and graph-native application development.", createdAt: "2024-01-25" },
  { id: "person:carlos-rivera", name: "Carlos Rivera", email: "carlos@example.com", title: "Staff Engineer", location: "Mexico City, Mexico", experienceYears: 10, bio: "Staff engineer with deep expertise in system design and distributed architectures.", createdAt: "2024-01-26" },
  { id: "person:nina-petrov", name: "Nina Petrov", email: "nina@example.com", title: "Frontend Engineer", location: "Warsaw, Poland", experienceYears: 3, bio: "Frontend engineer building accessible, performant UIs with Next.js and TypeScript.", createdAt: "2024-01-27" },
  { id: "person:kwame-asante", name: "Kwame Asante", email: "kwame@example.com", title: "Backend Engineer", location: "Accra, Ghana", experienceYears: 4, bio: "Backend engineer building microservices with Python, FastAPI and PostgreSQL.", createdAt: "2024-01-28" },
  { id: "person:isabella-rossi", name: "Isabella Rossi", email: "isabella@example.com", title: "AI Engineer", location: "Milan, Italy", experienceYears: 4, bio: "AI engineer working on LangChain, RAG, and intelligent document processing.", createdAt: "2024-01-29" },
  { id: "person:omar-sheikh", name: "Omar Sheikh", email: "omar@example.com", title: "DevOps Engineer", location: "Karachi, Pakistan", experienceYears: 5, bio: "DevOps engineer specializing in Docker, Kubernetes, and CI/CD automation.", createdAt: "2024-01-30" },
  { id: "person:zoe-williams", name: "Zoe Williams", email: "zoe@example.com", title: "Data Engineer", location: "London, UK", experienceYears: 4, bio: "Data engineer building ELT pipelines with dbt, Spark, and Kafka.", createdAt: "2024-02-01" },
  { id: "person:ravi-krishnan", name: "Ravi Krishnan", email: "ravi@example.com", title: "Senior Backend Engineer", location: "Chennai, India", experienceYears: 7, bio: "Senior backend engineer with expertise in Go, distributed systems, and microservices.", createdAt: "2024-02-02" },
  { id: "person:sofia-garcia", name: "Sofia Garcia", email: "sofia@example.com", title: "Full Stack Engineer", location: "Madrid, Spain", experienceYears: 3, bio: "Full-stack engineer building React/Node.js applications with a focus on UX.", createdAt: "2024-02-03" },
  { id: "person:daniel-kim", name: "Daniel Kim", email: "daniel@example.com", title: "ML Engineer", location: "Seoul, South Korea", experienceYears: 5, bio: "ML engineer with focus on deep learning, PyTorch, and production model deployment.", createdAt: "2024-02-04" },
  { id: "person:amelia-johnson", name: "Amelia Johnson", email: "amelia@example.com", title: "Principal Engineer", location: "Austin, TX", experienceYears: 12, bio: "Principal engineer with 12 years across system design, cloud, and team leadership.", createdAt: "2024-02-05" },
  { id: "person:felix-mueller", name: "Felix Mueller", email: "felix@example.com", title: "Cloud Engineer", location: "Munich, Germany", experienceYears: 6, bio: "Cloud engineer specializing in GCP, Kubernetes, and Terraform.", createdAt: "2024-02-06" },
  { id: "person:nia-osei", name: "Nia Osei", email: "nia@example.com", title: "Junior Software Engineer", location: "Nairobi, Kenya", experienceYears: 1, bio: "Junior engineer building React frontends and learning backend engineering.", createdAt: "2024-02-07" },
  { id: "person:raj-patel", name: "Raj Patel", email: "raj@example.com", title: "Engineering Lead", location: "Toronto, Canada", experienceYears: 9, bio: "Engineering lead with experience managing teams and driving technical architecture.", createdAt: "2024-02-08" },
  { id: "person:lin-wei", name: "Lin Wei", email: "lin@example.com", title: "Senior Frontend Engineer", location: "Shanghai, China", experienceYears: 6, bio: "Senior frontend engineer specializing in React performance, micro-frontends and Vue.", createdAt: "2024-02-09" },
];

// ============================================
// RELATIONSHIPS
// ============================================

// Person → HAS_SKILL
const personSkills: [string, string, string, number][] = [
  // santosh-patel
  ["person:santosh-patel", "skill:react", "advanced", 3],
  ["person:santosh-patel", "skill:nextjs", "advanced", 2],
  ["person:santosh-patel", "skill:typescript", "advanced", 3],
  ["person:santosh-patel", "skill:nodejs", "intermediate", 3],
  ["person:santosh-patel", "skill:express", "intermediate", 3],
  ["person:santosh-patel", "skill:mongodb", "intermediate", 2],
  ["person:santosh-patel", "skill:postgresql", "intermediate", 2],
  ["person:santosh-patel", "skill:docker", "intermediate", 2],
  ["person:santosh-patel", "skill:systemdesign", "intermediate", 2],
  ["person:santosh-patel", "skill:css", "advanced", 4],
  ["person:santosh-patel", "skill:javascript", "advanced", 4],
  ["person:santosh-patel", "skill:graphql", "beginner", 1],
  // priya-sharma
  ["person:priya-sharma", "skill:react", "expert", 3],
  ["person:priya-sharma", "skill:typescript", "advanced", 3],
  ["person:priya-sharma", "skill:javascript", "expert", 3],
  ["person:priya-sharma", "skill:css", "expert", 3],
  ["person:priya-sharma", "skill:nextjs", "intermediate", 1],
  ["person:priya-sharma", "skill:graphql", "intermediate", 2],
  // arjun-mehta
  ["person:arjun-mehta", "skill:python", "expert", 5],
  ["person:arjun-mehta", "skill:llm", "expert", 3],
  ["person:arjun-mehta", "skill:rag", "advanced", 2],
  ["person:arjun-mehta", "skill:langchain", "advanced", 2],
  ["person:arjun-mehta", "skill:fastapi", "advanced", 3],
  ["person:arjun-mehta", "skill:ml", "advanced", 4],
  ["person:arjun-mehta", "skill:postgresql", "intermediate", 3],
  // elena-volkov
  ["person:elena-volkov", "skill:python", "expert", 5],
  ["person:elena-volkov", "skill:spark", "expert", 4],
  ["person:elena-volkov", "skill:kafka", "advanced", 4],
  ["person:elena-volkov", "skill:dbt", "advanced", 3],
  ["person:elena-volkov", "skill:postgresql", "advanced", 5],
  ["person:elena-volkov", "skill:aws", "intermediate", 3],
  // james-okafor
  ["person:james-okafor", "skill:kubernetes", "expert", 5],
  ["person:james-okafor", "skill:docker", "expert", 7],
  ["person:james-okafor", "skill:aws", "expert", 6],
  ["person:james-okafor", "skill:cicd", "expert", 6],
  ["person:james-okafor", "skill:linux", "expert", 7],
  ["person:james-okafor", "skill:terraform", "advanced", 4],
  // sarah-chen
  ["person:sarah-chen", "skill:pytorch", "expert", 4],
  ["person:sarah-chen", "skill:python", "expert", 5],
  ["person:sarah-chen", "skill:ml", "expert", 5],
  ["person:sarah-chen", "skill:docker", "intermediate", 2],
  ["person:sarah-chen", "skill:aws", "intermediate", 2],
  // miguel-santos
  ["person:miguel-santos", "skill:go", "advanced", 3],
  ["person:miguel-santos", "skill:postgresql", "advanced", 4],
  ["person:miguel-santos", "skill:docker", "advanced", 3],
  ["person:miguel-santos", "skill:redis", "intermediate", 2],
  ["person:miguel-santos", "skill:microservices", "advanced", 3],
  ["person:miguel-santos", "skill:testing", "intermediate", 3],
  // aisha-al-rashid
  ["person:aisha-al-rashid", "skill:aws", "expert", 5],
  ["person:aisha-al-rashid", "skill:kubernetes", "expert", 4],
  ["person:aisha-al-rashid", "skill:terraform", "expert", 4],
  ["person:aisha-al-rashid", "skill:docker", "expert", 5],
  ["person:aisha-al-rashid", "skill:azure", "advanced", 3],
  // liam-kelly
  ["person:liam-kelly", "skill:react", "intermediate", 2],
  ["person:liam-kelly", "skill:nodejs", "intermediate", 2],
  ["person:liam-kelly", "skill:postgresql", "beginner", 1],
  ["person:liam-kelly", "skill:typescript", "intermediate", 2],
  ["person:liam-kelly", "skill:css", "intermediate", 2],
  // yuki-tanaka
  ["person:yuki-tanaka", "skill:typescript", "expert", 7],
  ["person:yuki-tanaka", "skill:react", "expert", 7],
  ["person:yuki-tanaka", "skill:nodejs", "expert", 7],
  ["person:yuki-tanaka", "skill:postgresql", "expert", 6],
  ["person:yuki-tanaka", "skill:systemdesign", "advanced", 6],
  ["person:yuki-tanaka", "skill:microservices", "advanced", 5],
  ["person:yuki-tanaka", "skill:docker", "advanced", 5],
  // amara-diallo
  ["person:amara-diallo", "skill:neo4j", "expert", 6],
  ["person:amara-diallo", "skill:python", "advanced", 5],
  ["person:amara-diallo", "skill:postgresql", "advanced", 5],
  ["person:amara-diallo", "skill:graphql", "advanced", 4],
  ["person:amara-diallo", "skill:systemdesign", "advanced", 5],
  // carlos-rivera
  ["person:carlos-rivera", "skill:systemdesign", "expert", 9],
  ["person:carlos-rivera", "skill:microservices", "expert", 8],
  ["person:carlos-rivera", "skill:aws", "expert", 8],
  ["person:carlos-rivera", "skill:kubernetes", "advanced", 6],
  ["person:carlos-rivera", "skill:go", "advanced", 5],
  ["person:carlos-rivera", "skill:postgresql", "advanced", 8],
  // nina-petrov
  ["person:nina-petrov", "skill:react", "advanced", 3],
  ["person:nina-petrov", "skill:nextjs", "advanced", 2],
  ["person:nina-petrov", "skill:typescript", "advanced", 3],
  ["person:nina-petrov", "skill:css", "expert", 3],
  // kwame-asante
  ["person:kwame-asante", "skill:python", "advanced", 4],
  ["person:kwame-asante", "skill:fastapi", "advanced", 3],
  ["person:kwame-asante", "skill:postgresql", "intermediate", 3],
  ["person:kwame-asante", "skill:docker", "intermediate", 2],
  ["person:kwame-asante", "skill:redis", "beginner", 1],
  // isabella-rossi
  ["person:isabella-rossi", "skill:python", "advanced", 4],
  ["person:isabella-rossi", "skill:langchain", "expert", 3],
  ["person:isabella-rossi", "skill:llm", "advanced", 3],
  ["person:isabella-rossi", "skill:rag", "advanced", 2],
  ["person:isabella-rossi", "skill:fastapi", "intermediate", 2],
  // omar-sheikh
  ["person:omar-sheikh", "skill:docker", "expert", 5],
  ["person:omar-sheikh", "skill:kubernetes", "advanced", 4],
  ["person:omar-sheikh", "skill:cicd", "expert", 5],
  ["person:omar-sheikh", "skill:linux", "expert", 5],
  ["person:omar-sheikh", "skill:aws", "intermediate", 3],
  // zoe-williams
  ["person:zoe-williams", "skill:python", "advanced", 4],
  ["person:zoe-williams", "skill:dbt", "advanced", 3],
  ["person:zoe-williams", "skill:spark", "intermediate", 2],
  ["person:zoe-williams", "skill:kafka", "intermediate", 2],
  ["person:zoe-williams", "skill:postgresql", "advanced", 4],
  // ravi-krishnan
  ["person:ravi-krishnan", "skill:go", "expert", 7],
  ["person:ravi-krishnan", "skill:microservices", "expert", 6],
  ["person:ravi-krishnan", "skill:postgresql", "expert", 7],
  ["person:ravi-krishnan", "skill:redis", "advanced", 5],
  ["person:ravi-krishnan", "skill:kubernetes", "advanced", 4],
  ["person:ravi-krishnan", "skill:systemdesign", "advanced", 7],
  // sofia-garcia
  ["person:sofia-garcia", "skill:react", "advanced", 3],
  ["person:sofia-garcia", "skill:nodejs", "intermediate", 2],
  ["person:sofia-garcia", "skill:typescript", "intermediate", 2],
  ["person:sofia-garcia", "skill:postgresql", "beginner", 1],
  ["person:sofia-garcia", "skill:css", "advanced", 3],
  // daniel-kim
  ["person:daniel-kim", "skill:pytorch", "expert", 5],
  ["person:daniel-kim", "skill:python", "expert", 5],
  ["person:daniel-kim", "skill:ml", "expert", 5],
  ["person:daniel-kim", "skill:aws", "intermediate", 3],
  ["person:daniel-kim", "skill:docker", "intermediate", 2],
  // amelia-johnson
  ["person:amelia-johnson", "skill:systemdesign", "expert", 12],
  ["person:amelia-johnson", "skill:aws", "expert", 10],
  ["person:amelia-johnson", "skill:microservices", "expert", 10],
  ["person:amelia-johnson", "skill:kubernetes", "expert", 8],
  ["person:amelia-johnson", "skill:typescript", "advanced", 8],
  ["person:amelia-johnson", "skill:react", "advanced", 6],
  ["person:amelia-johnson", "skill:postgresql", "advanced", 10],
  // felix-mueller
  ["person:felix-mueller", "skill:gcp", "expert", 6],
  ["person:felix-mueller", "skill:kubernetes", "expert", 5],
  ["person:felix-mueller", "skill:terraform", "advanced", 4],
  ["person:felix-mueller", "skill:docker", "advanced", 5],
  ["person:felix-mueller", "skill:linux", "advanced", 5],
  // nia-osei
  ["person:nia-osei", "skill:react", "beginner", 1],
  ["person:nia-osei", "skill:javascript", "intermediate", 1],
  ["person:nia-osei", "skill:css", "intermediate", 1],
  // raj-patel
  ["person:raj-patel", "skill:systemdesign", "expert", 9],
  ["person:raj-patel", "skill:typescript", "advanced", 7],
  ["person:raj-patel", "skill:react", "advanced", 7],
  ["person:raj-patel", "skill:nodejs", "advanced", 7],
  ["person:raj-patel", "skill:aws", "advanced", 5],
  ["person:raj-patel", "skill:microservices", "advanced", 6],
  // lin-wei
  ["person:lin-wei", "skill:react", "expert", 6],
  ["person:lin-wei", "skill:vue", "expert", 5],
  ["person:lin-wei", "skill:typescript", "expert", 6],
  ["person:lin-wei", "skill:nextjs", "advanced", 4],
  ["person:lin-wei", "skill:css", "expert", 6],
];

// Person → WORKED_ON
const personProjects: [string, string, string, string][] = [
  ["person:santosh-patel", "proj:careergraph", "Full Stack Developer", "3 months"],
  ["person:santosh-patel", "proj:food-donation", "Full Stack Developer", "6 months"],
  ["person:santosh-patel", "proj:hotel-booking", "Full Stack Developer", "4 months"],
  ["person:santosh-patel", "proj:blog-platform", "Frontend Lead", "2 months"],
  ["person:priya-sharma", "proj:design-system", "Frontend Lead", "4 months"],
  ["person:priya-sharma", "proj:portfolio-site", "Frontend Developer", "1 month"],
  ["person:arjun-mehta", "proj:rag-assistant", "AI Engineer", "5 months"],
  ["person:arjun-mehta", "proj:ml-classifier", "ML Engineer", "3 months"],
  ["person:elena-volkov", "proj:data-pipeline", "Data Engineer Lead", "8 months"],
  ["person:james-okafor", "proj:kubernetes-platform", "DevOps Lead", "6 months"],
  ["person:james-okafor", "proj:monitoring-dashboard", "DevOps Engineer", "4 months"],
  ["person:sarah-chen", "proj:ml-classifier", "ML Engineer", "4 months"],
  ["person:sarah-chen", "proj:price-predictor", "ML Lead", "6 months"],
  ["person:miguel-santos", "proj:api-gateway", "Backend Lead", "5 months"],
  ["person:miguel-santos", "proj:ecommerce-api", "Backend Developer", "6 months"],
  ["person:aisha-al-rashid", "proj:kubernetes-platform", "Cloud Architect", "4 months"],
  ["person:liam-kelly", "proj:chat-app", "Full Stack Developer", "3 months"],
  ["person:liam-kelly", "proj:hotel-booking", "Backend Developer", "2 months"],
  ["person:yuki-tanaka", "proj:auth-service", "Lead Engineer", "4 months"],
  ["person:yuki-tanaka", "proj:ecommerce-api", "Backend Architect", "6 months"],
  ["person:amara-diallo", "proj:graph-analytics", "Graph Engineer Lead", "6 months"],
  ["person:amara-diallo", "proj:careergraph", "Graph DB Advisor", "1 month"],
  ["person:carlos-rivera", "proj:monitoring-dashboard", "Architect", "2 months"],
  ["person:nina-petrov", "proj:design-system", "Frontend Developer", "3 months"],
  ["person:nina-petrov", "proj:blog-platform", "Frontend Developer", "2 months"],
  ["person:kwame-asante", "proj:auth-service", "Backend Developer", "3 months"],
  ["person:kwame-asante", "proj:notification-service", "Backend Developer", "3 months"],
  ["person:isabella-rossi", "proj:rag-assistant", "AI Engineer", "4 months"],
  ["person:omar-sheikh", "proj:kubernetes-platform", "DevOps Engineer", "5 months"],
  ["person:zoe-williams", "proj:data-pipeline", "Data Engineer", "6 months"],
  ["person:ravi-krishnan", "proj:api-gateway", "Senior Backend Engineer", "4 months"],
  ["person:sofia-garcia", "proj:portfolio-site", "Full Stack Developer", "1 month"],
  ["person:daniel-kim", "proj:price-predictor", "ML Engineer", "5 months"],
  ["person:raj-patel", "proj:ecommerce-api", "Engineering Lead", "4 months"],
  ["person:lin-wei", "proj:design-system", "Senior Frontend Engineer", "4 months"],
  ["person:nia-osei", "proj:portfolio-site", "Junior Frontend Developer", "1 month"],
];

// Person → TARGETS role
const personTargets: [string, string][] = [
  ["person:santosh-patel", "role:senior-fullstack"],
  ["person:priya-sharma", "role:lead-engineer"],
  ["person:arjun-mehta", "role:ml-engineer"],
  ["person:elena-volkov", "role:staff-engineer"],
  ["person:james-okafor", "role:cloud-engineer"],
  ["person:sarah-chen", "role:ml-engineer"],
  ["person:liam-kelly", "role:fullstack-engineer"],
  ["person:nina-petrov", "role:senior-fullstack"],
  ["person:kwame-asante", "role:backend-engineer"],
  ["person:isabella-rossi", "role:ai-engineer"],
  ["person:nia-osei", "role:junior-engineer"],
  ["person:sofia-garcia", "role:fullstack-engineer"],
  ["person:daniel-kim", "role:ml-engineer"],
];

// Role → REQUIRES_SKILL
const roleSkills: [string, string, string, string][] = [
  // frontend-engineer
  ["role:frontend-engineer", "skill:react", "critical", "advanced"],
  ["role:frontend-engineer", "skill:typescript", "critical", "intermediate"],
  ["role:frontend-engineer", "skill:javascript", "critical", "advanced"],
  ["role:frontend-engineer", "skill:css", "high", "intermediate"],
  ["role:frontend-engineer", "skill:nextjs", "medium", "intermediate"],
  ["role:frontend-engineer", "skill:graphql", "low", "beginner"],
  // backend-engineer
  ["role:backend-engineer", "skill:nodejs", "critical", "intermediate"],
  ["role:backend-engineer", "skill:postgresql", "high", "intermediate"],
  ["role:backend-engineer", "skill:docker", "high", "intermediate"],
  ["role:backend-engineer", "skill:redis", "medium", "beginner"],
  ["role:backend-engineer", "skill:testing", "medium", "intermediate"],
  // fullstack-engineer
  ["role:fullstack-engineer", "skill:react", "critical", "intermediate"],
  ["role:fullstack-engineer", "skill:nodejs", "critical", "intermediate"],
  ["role:fullstack-engineer", "skill:typescript", "high", "intermediate"],
  ["role:fullstack-engineer", "skill:postgresql", "high", "beginner"],
  ["role:fullstack-engineer", "skill:docker", "medium", "beginner"],
  // senior-fullstack
  ["role:senior-fullstack", "skill:react", "critical", "advanced"],
  ["role:senior-fullstack", "skill:nodejs", "critical", "advanced"],
  ["role:senior-fullstack", "skill:typescript", "critical", "advanced"],
  ["role:senior-fullstack", "skill:postgresql", "high", "intermediate"],
  ["role:senior-fullstack", "skill:docker", "high", "intermediate"],
  ["role:senior-fullstack", "skill:systemdesign", "high", "intermediate"],
  ["role:senior-fullstack", "skill:aws", "medium", "beginner"],
  // ai-engineer
  ["role:ai-engineer", "skill:python", "critical", "advanced"],
  ["role:ai-engineer", "skill:llm", "critical", "intermediate"],
  ["role:ai-engineer", "skill:langchain", "high", "intermediate"],
  ["role:ai-engineer", "skill:rag", "high", "intermediate"],
  ["role:ai-engineer", "skill:fastapi", "medium", "intermediate"],
  ["role:ai-engineer", "skill:docker", "medium", "beginner"],
  // ml-engineer
  ["role:ml-engineer", "skill:pytorch", "critical", "advanced"],
  ["role:ml-engineer", "skill:python", "critical", "expert"],
  ["role:ml-engineer", "skill:ml", "critical", "advanced"],
  ["role:ml-engineer", "skill:docker", "high", "intermediate"],
  ["role:ml-engineer", "skill:aws", "medium", "intermediate"],
  // devops-engineer
  ["role:devops-engineer", "skill:kubernetes", "critical", "advanced"],
  ["role:devops-engineer", "skill:docker", "critical", "advanced"],
  ["role:devops-engineer", "skill:cicd", "critical", "advanced"],
  ["role:devops-engineer", "skill:linux", "high", "advanced"],
  ["role:devops-engineer", "skill:aws", "high", "intermediate"],
  // cloud-engineer
  ["role:cloud-engineer", "skill:aws", "critical", "advanced"],
  ["role:cloud-engineer", "skill:kubernetes", "critical", "advanced"],
  ["role:cloud-engineer", "skill:terraform", "critical", "advanced"],
  ["role:cloud-engineer", "skill:docker", "high", "intermediate"],
  ["role:cloud-engineer", "skill:linux", "high", "intermediate"],
  // data-engineer
  ["role:data-engineer", "skill:python", "critical", "advanced"],
  ["role:data-engineer", "skill:spark", "critical", "advanced"],
  ["role:data-engineer", "skill:kafka", "high", "intermediate"],
  ["role:data-engineer", "skill:dbt", "high", "intermediate"],
  ["role:data-engineer", "skill:postgresql", "high", "intermediate"],
  // staff-engineer
  ["role:staff-engineer", "skill:systemdesign", "critical", "expert"],
  ["role:staff-engineer", "skill:microservices", "critical", "expert"],
  ["role:staff-engineer", "skill:aws", "high", "advanced"],
  ["role:staff-engineer", "skill:postgresql", "high", "advanced"],
  ["role:staff-engineer", "skill:kubernetes", "medium", "intermediate"],
  // graph-engineer
  ["role:graph-engineer", "skill:neo4j", "critical", "advanced"],
  ["role:graph-engineer", "skill:python", "critical", "advanced"],
  ["role:graph-engineer", "skill:postgresql", "high", "advanced"],
  ["role:graph-engineer", "skill:systemdesign", "high", "intermediate"],
];

// Role → OFFERED_BY
const roleCompanies: [string, string][] = [
  ["role:fullstack-engineer", "company:vercel"],
  ["role:fullstack-engineer", "company:linear"],
  ["role:fullstack-engineer", "company:notion"],
  ["role:senior-fullstack", "company:vercel"],
  ["role:senior-fullstack", "company:stripe"],
  ["role:senior-fullstack", "company:shopify"],
  ["role:frontend-engineer", "company:linear"],
  ["role:frontend-engineer", "company:notion"],
  ["role:backend-engineer", "company:stripe"],
  ["role:backend-engineer", "company:cloudflare"],
  ["role:backend-engineer", "company:planetscale"],
  ["role:ai-engineer", "company:wexa-ai"],
  ["role:ai-engineer", "company:hugging-face"],
  ["role:ml-engineer", "company:databricks"],
  ["role:ml-engineer", "company:hugging-face"],
  ["role:ml-engineer", "company:wexa-ai"],
  ["role:devops-engineer", "company:cloudflare"],
  ["role:devops-engineer", "company:shopify"],
  ["role:cloud-engineer", "company:cloudflare"],
  ["role:data-engineer", "company:databricks"],
  ["role:staff-engineer", "company:stripe"],
  ["role:principal-engineer", "company:stripe"],
  ["role:graph-engineer", "company:wexa-ai"],
  ["role:graph-engineer", "company:databricks"],
  ["role:software-engineer", "company:shopify"],
  ["role:software-engineer", "company:notion"],
  ["role:lead-engineer", "company:shopify"],
];

// Project → USES_SKILL
const projectSkills: [string, string, string][] = [
  ["proj:careergraph", "skill:nextjs", "critical"],
  ["proj:careergraph", "skill:typescript", "critical"],
  ["proj:careergraph", "skill:react", "critical"],
  ["proj:careergraph", "skill:neo4j", "critical"],
  ["proj:careergraph", "skill:nodejs", "high"],
  ["proj:careergraph", "skill:docker", "medium"],
  ["proj:food-donation", "skill:react", "critical"],
  ["proj:food-donation", "skill:nodejs", "critical"],
  ["proj:food-donation", "skill:mongodb", "high"],
  ["proj:food-donation", "skill:docker", "medium"],
  ["proj:hotel-booking", "skill:react", "critical"],
  ["proj:hotel-booking", "skill:nodejs", "critical"],
  ["proj:hotel-booking", "skill:postgresql", "high"],
  ["proj:blog-platform", "skill:react", "critical"],
  ["proj:blog-platform", "skill:nodejs", "high"],
  ["proj:blog-platform", "skill:mongodb", "high"],
  ["proj:ecommerce-api", "skill:nodejs", "critical"],
  ["proj:ecommerce-api", "skill:postgresql", "critical"],
  ["proj:ecommerce-api", "skill:redis", "high"],
  ["proj:ecommerce-api", "skill:graphql", "high"],
  ["proj:data-pipeline", "skill:python", "critical"],
  ["proj:data-pipeline", "skill:kafka", "critical"],
  ["proj:data-pipeline", "skill:spark", "high"],
  ["proj:data-pipeline", "skill:dbt", "high"],
  ["proj:ml-classifier", "skill:python", "critical"],
  ["proj:ml-classifier", "skill:pytorch", "high"],
  ["proj:ml-classifier", "skill:ml", "critical"],
  ["proj:chat-app", "skill:nodejs", "critical"],
  ["proj:chat-app", "skill:react", "critical"],
  ["proj:chat-app", "skill:redis", "high"],
  ["proj:auth-service", "skill:nodejs", "critical"],
  ["proj:auth-service", "skill:postgresql", "high"],
  ["proj:auth-service", "skill:redis", "medium"],
  ["proj:monitoring-dashboard", "skill:docker", "critical"],
  ["proj:monitoring-dashboard", "skill:kubernetes", "critical"],
  ["proj:monitoring-dashboard", "skill:react", "high"],
  ["proj:rag-assistant", "skill:python", "critical"],
  ["proj:rag-assistant", "skill:langchain", "critical"],
  ["proj:rag-assistant", "skill:rag", "critical"],
  ["proj:rag-assistant", "skill:llm", "critical"],
  ["proj:rag-assistant", "skill:fastapi", "high"],
  ["proj:graph-analytics", "skill:neo4j", "critical"],
  ["proj:graph-analytics", "skill:python", "critical"],
  ["proj:graph-analytics", "skill:react", "high"],
  ["proj:kubernetes-platform", "skill:kubernetes", "critical"],
  ["proj:kubernetes-platform", "skill:docker", "critical"],
  ["proj:kubernetes-platform", "skill:aws", "critical"],
  ["proj:kubernetes-platform", "skill:cicd", "high"],
  ["proj:api-gateway", "skill:go", "critical"],
  ["proj:api-gateway", "skill:redis", "high"],
  ["proj:api-gateway", "skill:docker", "high"],
  ["proj:price-predictor", "skill:python", "critical"],
  ["proj:price-predictor", "skill:pytorch", "high"],
  ["proj:price-predictor", "skill:ml", "critical"],
  ["proj:design-system", "skill:react", "critical"],
  ["proj:design-system", "skill:typescript", "critical"],
  ["proj:design-system", "skill:css", "critical"],
  ["proj:portfolio-site", "skill:react", "critical"],
  ["proj:portfolio-site", "skill:css", "high"],
  ["proj:portfolio-site", "skill:nextjs", "high"],
];

// Skill → RELATED_TO (bidirectional)
const skillRelations: [string, string, number][] = [
  ["skill:javascript", "skill:typescript", 0.95],
  ["skill:react", "skill:nextjs", 0.9],
  ["skill:react", "skill:vue", 0.7],
  ["skill:nodejs", "skill:express", 0.85],
  ["skill:nodejs", "skill:javascript", 0.9],
  ["skill:python", "skill:fastapi", 0.85],
  ["skill:python", "skill:ml", 0.8],
  ["skill:python", "skill:pytorch", 0.75],
  ["skill:ml", "skill:pytorch", 0.9],
  ["skill:ml", "skill:llm", 0.7],
  ["skill:llm", "skill:rag", 0.85],
  ["skill:llm", "skill:langchain", 0.9],
  ["skill:langchain", "skill:rag", 0.85],
  ["skill:docker", "skill:kubernetes", 0.9],
  ["skill:docker", "skill:cicd", 0.75],
  ["skill:kubernetes", "skill:aws", 0.7],
  ["skill:kubernetes", "skill:gcp", 0.7],
  ["skill:aws", "skill:gcp", 0.65],
  ["skill:aws", "skill:azure", 0.65],
  ["skill:postgresql", "skill:mongodb", 0.6],
  ["skill:redis", "skill:postgresql", 0.5],
  ["skill:kafka", "skill:spark", 0.8],
  ["skill:kafka", "skill:dbt", 0.6],
  ["skill:systemdesign", "skill:microservices", 0.85],
  ["skill:graphql", "skill:nodejs", 0.7],
  ["skill:neo4j", "skill:graphql", 0.6],
  ["skill:neo4j", "skill:postgresql", 0.5],
  ["skill:fastapi", "skill:python", 0.95],
  ["skill:go", "skill:microservices", 0.75],
  ["skill:typescript", "skill:react", 0.85],
];

// Skill → HAS_RESOURCE
const skillResources: [string, string][] = [
  ["skill:typescript", "res:ts-handbook"],
  ["skill:react", "res:react-docs"],
  ["skill:nextjs", "res:nextjs-learn"],
  ["skill:nodejs", "res:node-course"],
  ["skill:express", "res:node-course"],
  ["skill:docker", "res:docker-guide"],
  ["skill:aws", "res:aws-practitioner"],
  ["skill:aws", "res:aws-developer"],
  ["skill:ml", "res:ml-course"],
  ["skill:systemdesign", "res:system-design"],
  ["skill:python", "res:python-fluent"],
  ["skill:kubernetes", "res:k8s-course"],
  ["skill:graphql", "res:graphql-how-to"],
  ["skill:langchain", "res:langchain-docs"],
  ["skill:pytorch", "res:pytorch-tutorial"],
  ["skill:kafka", "res:kafka-definitive"],
  ["skill:neo4j", "res:neo4j-fundamentals"],
  ["skill:go", "res:go-tour"],
  ["skill:postgresql", "res:postgres-tutorial"],
  ["skill:rag", "res:rag-guide"],
  ["skill:fastapi", "res:fastapi-docs"],
  ["skill:llm", "res:langchain-docs"],
  ["skill:llm", "res:rag-guide"],
];

// ============================================
// SEED FUNCTION
// ============================================

async function seed() {
  const session = driver.session({ database: DATABASE });

  try {
    console.log("\n🚀 CareerGraph — Database Seed Starting\n");
    console.log(`📡 Connecting to: ${URI}`);

    await driver.verifyConnectivity();
    console.log("✅ Connected to CognoDB\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await run(session, "MATCH (n) DETACH DELETE n");

    // Constraints
    await createConstraints(session);

    // Skills
    console.log("⚡ Seeding skills...");
    for (const skill of skills) {
      await run(session, `
        MERGE (s:Skill {id: $id})
        SET s += $props
      `, { id: skill.id, props: skill });
    }
    console.log(`   ✓ ${skills.length} skills`);

    // Learning Resources
    console.log("📚 Seeding learning resources...");
    for (const res of resources) {
      await run(session, `
        MERGE (lr:LearningResource {id: $id})
        SET lr += $props
      `, { id: res.id, props: res });
    }
    console.log(`   ✓ ${resources.length} resources`);

    // Companies
    console.log("🏢 Seeding companies...");
    for (const company of companies) {
      await run(session, `
        MERGE (c:Company {id: $id})
        SET c += $props
      `, { id: company.id, props: company });
    }
    console.log(`   ✓ ${companies.length} companies`);

    // Roles
    console.log("💼 Seeding roles...");
    for (const role of roles) {
      await run(session, `
        MERGE (r:Role {id: $id})
        SET r += $props
      `, { id: role.id, props: role });
    }
    console.log(`   ✓ ${roles.length} roles`);

    // Projects
    console.log("🔨 Seeding projects...");
    for (const project of projects) {
      await run(session, `
        MERGE (p:Project {id: $id})
        SET p += $props
      `, { id: project.id, props: { ...project, year: neo4j.int(project.year) } });
    }
    console.log(`   ✓ ${projects.length} projects`);

    // People
    console.log("👥 Seeding people...");
    for (const person of people) {
      await run(session, `
        MERGE (p:Person {id: $id})
        SET p += $props
      `, { id: person.id, props: { ...person, experienceYears: neo4j.int(person.experienceYears) } });
    }
    console.log(`   ✓ ${people.length} people`);

    // Person → HAS_SKILL
    console.log("🔗 Creating HAS_SKILL relationships...");
    for (const [personId, skillId, level, years] of personSkills) {
      await run(session, `
        MATCH (p:Person {id: $personId})
        MATCH (s:Skill {id: $skillId})
        MERGE (p)-[r:HAS_SKILL]->(s)
        SET r.level = $level, r.years = $years
      `, { personId, skillId, level, years: neo4j.int(years) });
    }
    console.log(`   ✓ ${personSkills.length} HAS_SKILL relationships`);

    // Person → WORKED_ON
    console.log("🔗 Creating WORKED_ON relationships...");
    for (const [personId, projectId, role, duration] of personProjects) {
      await run(session, `
        MATCH (p:Person {id: $personId})
        MATCH (proj:Project {id: $projectId})
        MERGE (p)-[r:WORKED_ON]->(proj)
        SET r.role = $role, r.duration = $duration
      `, { personId, projectId, role, duration });
    }
    console.log(`   ✓ ${personProjects.length} WORKED_ON relationships`);

    // Person → TARGETS
    console.log("🔗 Creating TARGETS relationships...");
    for (const [personId, roleId] of personTargets) {
      await run(session, `
        MATCH (p:Person {id: $personId})
        MATCH (r:Role {id: $roleId})
        MERGE (p)-[:TARGETS]->(r)
      `, { personId, roleId });
    }
    console.log(`   ✓ ${personTargets.length} TARGETS relationships`);

    // Role → REQUIRES_SKILL
    console.log("🔗 Creating REQUIRES_SKILL relationships...");
    for (const [roleId, skillId, importance, minimumLevel] of roleSkills) {
      await run(session, `
        MATCH (r:Role {id: $roleId})
        MATCH (s:Skill {id: $skillId})
        MERGE (r)-[rel:REQUIRES_SKILL]->(s)
        SET rel.importance = $importance, rel.minimumLevel = $minimumLevel
      `, { roleId, skillId, importance, minimumLevel });
    }
    console.log(`   ✓ ${roleSkills.length} REQUIRES_SKILL relationships`);

    // Role → OFFERED_BY
    console.log("🔗 Creating OFFERED_BY relationships...");
    for (const [roleId, companyId] of roleCompanies) {
      await run(session, `
        MATCH (r:Role {id: $roleId})
        MATCH (c:Company {id: $companyId})
        MERGE (r)-[:OFFERED_BY]->(c)
      `, { roleId, companyId });
    }
    console.log(`   ✓ ${roleCompanies.length} OFFERED_BY relationships`);

    // Project → USES_SKILL
    console.log("🔗 Creating USES_SKILL relationships...");
    for (const [projectId, skillId, importance] of projectSkills) {
      await run(session, `
        MATCH (proj:Project {id: $projectId})
        MATCH (s:Skill {id: $skillId})
        MERGE (proj)-[r:USES_SKILL]->(s)
        SET r.importance = $importance
      `, { projectId, skillId, importance });
    }
    console.log(`   ✓ ${projectSkills.length} USES_SKILL relationships`);

    // Also add HIRING_FOR (mirrors OFFERED_BY in reverse)
    await run(session, `
      MATCH (c:Company)<-[:OFFERED_BY]-(r:Role)
      MERGE (c)-[:HIRING_FOR]->(r)
    `);
    console.log("   ✓ HIRING_FOR relationships (mirrored from OFFERED_BY)");

    // Skill → RELATED_TO
    console.log("🔗 Creating RELATED_TO relationships...");
    for (const [s1, s2, strength] of skillRelations) {
      await run(session, `
        MATCH (a:Skill {id: $s1})
        MATCH (b:Skill {id: $s2})
        MERGE (a)-[r:RELATED_TO]-(b)
        SET r.strength = $strength
      `, { s1, s2, strength });
    }
    console.log(`   ✓ ${skillRelations.length} RELATED_TO relationships`);

    // Skill → HAS_RESOURCE
    console.log("🔗 Creating HAS_RESOURCE relationships...");
    for (const [skillId, resourceId] of skillResources) {
      await run(session, `
        MATCH (s:Skill {id: $skillId})
        MATCH (lr:LearningResource {id: $resourceId})
        MERGE (s)-[:HAS_RESOURCE]->(lr)
      `, { skillId, resourceId });
    }
    console.log(`   ✓ ${skillResources.length} HAS_RESOURCE relationships`);

    // ============================================
    // VERIFY COUNTS
    // ============================================
    console.log("\n📊 Verifying seed data...");

    const counts = await session.run(`
      MATCH (p:Person) WITH count(p) AS people
      MATCH (s:Skill) WITH people, count(s) AS skills
      MATCH (proj:Project) WITH people, skills, count(proj) AS projects
      MATCH (r:Role) WITH people, skills, projects, count(r) AS roles
      MATCH (c:Company) WITH people, skills, projects, roles, count(c) AS companies
      MATCH (lr:LearningResource) WITH people, skills, projects, roles, companies, count(lr) AS resources
      MATCH ()-[rel]->() WITH people, skills, projects, roles, companies, resources, count(rel) AS relationships
      RETURN people, skills, projects, roles, companies, resources, relationships
    `);

    const rec = counts.records[0];
    console.log("\n✅ CareerGraph database seeded successfully!\n");
    console.log("┌─────────────────────────────┐");
    console.log("│     CareerGraph Summary     │");
    console.log("├────────────────────┬────────┤");
    console.log(`│ People             │   ${String(rec.get("people").toNumber()).padStart(4)} │`);
    console.log(`│ Skills             │   ${String(rec.get("skills").toNumber()).padStart(4)} │`);
    console.log(`│ Projects           │   ${String(rec.get("projects").toNumber()).padStart(4)} │`);
    console.log(`│ Roles              │   ${String(rec.get("roles").toNumber()).padStart(4)} │`);
    console.log(`│ Companies          │   ${String(rec.get("companies").toNumber()).padStart(4)} │`);
    console.log(`│ Learning Resources │   ${String(rec.get("resources").toNumber()).padStart(4)} │`);
    console.log(`│ Relationships      │   ${String(rec.get("relationships").toNumber()).padStart(4)} │`);
    console.log("└────────────────────┴────────┘\n");

  } catch (err) {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
