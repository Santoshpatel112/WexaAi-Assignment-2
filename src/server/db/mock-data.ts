import type {
  Person, Skill, Project, Role, Company, LearningResource,
  PersonDetail, SkillDetail, RoleDetail, CompanyDetail,
  GraphData, GraphStats, RoleMatch, CareerPath
} from "@/types";

export const MOCK_SKILLS: Skill[] = [
  { id: "skill:javascript", name: "JavaScript", category: "Frontend", difficulty: "Intermediate", description: "Core web scripting language" },
  { id: "skill:typescript", name: "TypeScript", category: "Frontend", difficulty: "Intermediate", description: "Typed superset of JavaScript" },
  { id: "skill:react", name: "React", category: "Frontend", difficulty: "Intermediate", description: "UI component library by Meta" },
  { id: "skill:nextjs", name: "Next.js", category: "Frontend", difficulty: "Advanced", description: "React framework for production" },
  { id: "skill:css", name: "CSS / Tailwind", category: "Frontend", difficulty: "Beginner", description: "Styling and layout for web" },
  { id: "skill:graphql", name: "GraphQL", category: "Frontend", difficulty: "Advanced", description: "API query language" },
  { id: "skill:nodejs", name: "Node.js", category: "Backend", difficulty: "Intermediate", description: "JavaScript runtime for backend" },
  { id: "skill:python", name: "Python", category: "Backend", difficulty: "Intermediate", description: "General-purpose programming language" },
  { id: "skill:fastapi", name: "FastAPI", category: "Backend", difficulty: "Intermediate", description: "Modern Python web framework" },
  { id: "skill:express", name: "Express.js", category: "Backend", difficulty: "Intermediate", description: "Minimal Node.js web framework" },
  { id: "skill:postgresql", name: "PostgreSQL", category: "Database", difficulty: "Intermediate", description: "Advanced open-source SQL database" },
  { id: "skill:neo4j", name: "Neo4j / CognoDB", category: "Database", difficulty: "Advanced", description: "Graph database with Cypher query language" },
  { id: "skill:docker", name: "Docker", category: "DevOps", difficulty: "Intermediate", description: "Containerization platform" },
  { id: "skill:kubernetes", name: "Kubernetes", category: "DevOps", difficulty: "Advanced", description: "Container orchestration system" },
  { id: "skill:aws", name: "AWS", category: "Cloud", difficulty: "Advanced", description: "Amazon Web Services cloud platform" },
  { id: "skill:llm", name: "LLMs / Prompt Engineering", category: "AI/ML", difficulty: "Intermediate", description: "Large language model integration" },
  { id: "skill:rag", name: "RAG Pipelines", category: "AI/ML", difficulty: "Advanced", description: "Retrieval augmented generation" },
  { id: "skill:systemdesign", name: "System Design", category: "Architecture", difficulty: "Expert", description: "Designing scalable distributed systems" },
];

export const MOCK_PEOPLE: Person[] = [
  {
    id: "person:santosh-patel",
    name: "Santosh Patel",
    email: "santosh@example.com",
    title: "Full Stack Engineer",
    location: "Mumbai, India",
    experienceYears: 4,
    bio: "Passionate full-stack engineer building products with React, Next.js, Node.js and graph databases. Currently exploring AI/ML integration.",
    createdAt: "2024-01-15",
  },
  {
    id: "person:priya-sharma",
    name: "Priya Sharma",
    email: "priya@example.com",
    title: "Frontend Engineer",
    location: "Bangalore, India",
    experienceYears: 3,
    bio: "Frontend specialist with deep expertise in React and TypeScript. Loves building performant UI.",
    createdAt: "2024-01-16",
  },
  {
    id: "person:arjun-mehta",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    title: "AI Engineer",
    location: "Hyderabad, India",
    experienceYears: 5,
    bio: "AI engineer specializing in LLM integration, RAG pipelines, and production ML systems.",
    createdAt: "2024-01-17",
  },
  {
    id: "person:elena-volkov",
    name: "Elena Volkov",
    email: "elena@example.com",
    title: "Data Engineer",
    location: "Berlin, Germany",
    experienceYears: 6,
    bio: "Data engineer building large-scale pipelines with Kafka, Spark and dbt.",
    createdAt: "2024-01-18",
  },
  {
    id: "person:amara-diallo",
    name: "Amara Diallo",
    email: "amara@example.com",
    title: "Graph Database Engineer",
    location: "Paris, France",
    experienceYears: 6,
    bio: "Specialist in Neo4j, CognoDB and graph-native application development.",
    createdAt: "2024-01-25",
  },
];

export const MOCK_PROJECTS: Project[] = [
  { id: "proj:careergraph", name: "CareerGraph", description: "Interactive career and skill knowledge graph", category: "SaaS", githubUrl: "https://github.com/santosh-patel/careergraph", year: 2024 },
  { id: "proj:food-donation", name: "Food Donation Platform", description: "Connects food donors with local shelters", category: "Social Impact", year: 2023 },
  { id: "proj:hotel-booking", name: "Hotel Booking Platform", description: "Full-stack hotel reservation system", category: "Travel", year: 2023 },
  { id: "proj:rag-assistant", name: "RAG Documentation Assistant", description: "LLM assistant with RAG over company docs", category: "AI", year: 2024 },
];

export const MOCK_ROLES: Role[] = [
  { id: "role:fullstack-engineer", title: "Full Stack Engineer", description: "Own features end-to-end", level: "Mid", salaryRange: "$130K–$175K" },
  { id: "role:senior-fullstack", title: "Senior Full Stack Engineer", description: "Lead feature teams", level: "Senior", salaryRange: "$160K–$210K" },
  { id: "role:ai-engineer", title: "AI Engineer", description: "Build LLM-powered products", level: "Mid", salaryRange: "$150K–$200K" },
  { id: "role:graph-engineer", title: "Graph Database Engineer", description: "Design and build graph database systems", level: "Senior", salaryRange: "$165K–$215K" },
];

export const MOCK_COMPANIES: Company[] = [
  { id: "company:wexa-ai", name: "Wexa AI", industry: "Artificial Intelligence", location: "San Francisco, CA", website: "https://wexa.ai" },
  { id: "company:vercel", name: "Vercel", industry: "Developer Tools", location: "Remote / San Francisco", website: "https://vercel.com" },
  { id: "company:stripe", name: "Stripe", industry: "FinTech", location: "San Francisco, CA", website: "https://stripe.com" },
  { id: "company:linear", name: "Linear", industry: "Developer Tools", location: "Remote", website: "https://linear.app" },
];

export const MOCK_RESOURCES: LearningResource[] = [
  { id: "res:docker-guide", title: "Docker Deep Dive", type: "Book", url: "https://www.amazon.com/Docker-Deep-Dive-Nigel-Poulton/dp/1916585256", provider: "Nigel Poulton", difficulty: "Intermediate" },
  { id: "res:aws-developer", title: "AWS Developer Associate", type: "Course", url: "https://aws.amazon.com/certification/certified-developer-associate/", provider: "AWS", difficulty: "Advanced" },
  { id: "res:system-design", title: "System Design Interview", type: "Book", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF", provider: "Alex Xu", difficulty: "Advanced" },
  { id: "res:neo4j-fundamentals", title: "Neo4j Graph Academy", type: "Course", url: "https://graphacademy.neo4j.com/", provider: "Neo4j", difficulty: "Beginner" },
];

export const MOCK_STATS: GraphStats = {
  people: 25,
  skills: 35,
  projects: 20,
  roles: 15,
  companies: 10,
  learningResources: 20,
  relationships: 312,
};
