// ============================================
// Core Entity Types
// ============================================

export interface Person {
  id: string;
  name: string;
  email: string;
  title: string;
  location: string;
  experienceYears: number;
  bio: string;
  avatar?: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: Difficulty;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  year: number;
}

export interface Role {
  id: string;
  title: string;
  description: string;
  level: RoleLevel;
  salaryRange: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website?: string;
  logo?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  provider: string;
  difficulty: Difficulty;
}

// ============================================
// Relationship Types
// ============================================

export interface PersonSkill {
  skill: Skill;
  level: SkillLevel;
  years: number;
}

export interface PersonProject {
  project: Project;
  role: string;
  duration: string;
}

export interface RoleSkill {
  skill: Skill;
  importance: Importance;
  minimumLevel: SkillLevel;
}

export interface ProjectSkill {
  skill: Skill;
  importance: Importance;
}

export interface SkillRelation {
  skill: Skill;
  strength: number;
}

// ============================================
// Enum Types
// ============================================

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "Cloud"
  | "AI/ML"
  | "Mobile"
  | "Design"
  | "Architecture"
  | "Testing"
  | "Data Engineering"
  | "Security";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type RoleLevel = "Junior" | "Mid" | "Senior" | "Lead" | "Principal" | "Staff";
export type Importance = "low" | "medium" | "high" | "critical";
export type ResourceType = "Course" | "Book" | "Tutorial" | "Documentation" | "Video" | "Article" | "Bootcamp";

// ============================================
// Graph Types
// ============================================

export type GraphNodeType = "Person" | "Skill" | "Project" | "Role" | "Company" | "LearningResource";
export type RelationshipType =
  | "HAS_SKILL"
  | "WORKED_ON"
  | "TARGETS"
  | "LEARNED"
  | "USES_SKILL"
  | "REQUIRES_SKILL"
  | "OFFERED_BY"
  | "RELATED_TO"
  | "HAS_RESOURCE"
  | "HIRING_FOR";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  properties: Record<string, unknown>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ============================================
// Rich Detail Types
// ============================================

export interface PersonDetail extends Person {
  skills: PersonSkill[];
  projects: PersonProject[];
  targetRoles: Role[];
}

export interface RoleDetail extends Role {
  requiredSkills: RoleSkill[];
  companies: Company[];
}

export interface SkillDetail extends Skill {
  people: Person[];
  projects: Project[];
  roles: Role[];
  relatedSkills: SkillRelation[];
  learningResources: LearningResource[];
}

export interface CompanyDetail extends Company {
  roles: Role[];
}

// ============================================
// Recommendation Types
// ============================================

export interface SkillMatch {
  skill: Skill;
  personLevel: SkillLevel;
  requiredLevel: SkillLevel;
  hasSkill: boolean;
}

export interface RoleMatch {
  role: Role;
  matchPercentage: number;
  matchedSkills: Skill[];
  missingSkills: Skill[];
  companies: Company[];
}

export interface LearningStep {
  skill: Skill;
  resources: LearningResource[];
  relatedSkills: Skill[];
}

export interface CareerPath {
  person: Person;
  targetRole: Role;
  matchPercentage: number;
  matchedSkills: Skill[];
  skillGaps: SkillGap[];
  learningPath: LearningStep[];
  estimatedMonths: number;
  recommendedCompanies: Company[];
}

export interface SkillGap {
  skill: Skill;
  importance: Importance;
  minimumLevel: SkillLevel;
  resources: LearningResource[];
  relatedOwnedSkills: Skill[];
}

export interface Recommendation {
  roles: RoleMatch[];
  topMissingSkills: Skill[];
  suggestedPeople: Person[];
}

// ============================================
// API Response Types
// ============================================

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Health Check
// ============================================

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  database: {
    connected: boolean;
    latencyMs?: number;
  };
  timestamp: string;
}

// ============================================
// Search
// ============================================

export interface SearchResults {
  people: Person[];
  skills: Skill[];
  roles: Role[];
  companies: Company[];
  projects: Project[];
  total: number;
}

// ============================================
// Stats / Dashboard
// ============================================

export interface GraphStats {
  people: number;
  skills: number;
  projects: number;
  roles: number;
  companies: number;
  learningResources: number;
  relationships: number;
}

// ============================================
// User Session & Onboarding Types
// ============================================

export type UserRole = "USER" | "ADMIN";

export interface UserSession {
  id: string; // e.g. "person:santosh-patel"
  clerkUserId?: string;
  name: string;
  email: string;
  title: string;
  avatar?: string;
  role?: UserRole;
  hasCompletedOnboarding: boolean;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalSkills: number;
  totalProjects: number;
  totalJobs: number;
  totalCompanies: number;
  totalApplications: number;
  totalSavedJobs: number;
  totalNodes: number;
  totalRelationships: number;
  popularSkills: Array<{ name: string; userCount: number }>;
  popularRoles: Array<{ title: string; applicantCount: number }>;
}

export interface OnboardingPayload {
  userId: string;
  name: string;
  title: string;
  experienceYears: number;
  location: string;
  bio: string;
  avatar?: string;
  skills: Array<{
    name: string;
    category: SkillCategory;
    level: SkillLevel;
    years: number;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
    role: string;
  }>;
  preferences: {
    targetRoleId: string;
    preferredLocation: string;
    workStyle: "remote" | "hybrid" | "onsite";
  };
}

export interface SavedJob {
  jobId: string;
  savedAt: string;
}

export interface JobApplication {
  jobId: string;
  status: "applied" | "interview" | "rejected" | "offer";
  appliedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}


