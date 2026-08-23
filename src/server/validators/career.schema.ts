// ============================================
// Zod Validators for all API inputs
// ============================================

import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});

export const SearchSchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const PeopleFilterSchema = z.object({
  search: z.string().optional(),
  skill: z.string().optional(),
  location: z.string().optional(),
  minExperience: z.coerce.number().int().min(0).optional(),
  maxExperience: z.coerce.number().int().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});

export const SkillFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});

export const RoleFilterSchema = z.object({
  search: z.string().optional(),
  level: z.string().optional(),
  company: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});

export const CompanyFilterSchema = z.object({
  search: z.string().optional(),
  industry: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});

export const RecommendationSchema = z.object({
  personId: z.string().min(1),
  targetRoleId: z.string().min(1),
});

export const CareerPathSchema = z.object({
  personId: z.string().min(1),
  targetRoleId: z.string().min(1),
});

export const GraphExpandSchema = z.object({
  nodeId: z.string().min(1),
  nodeType: z.enum(["Person", "Skill", "Project", "Role", "Company", "LearningResource"]),
  relationshipTypes: z.array(z.string()).optional(),
  depth: z.number().int().min(1).max(3).default(1),
});

export const IdParamSchema = z.object({
  id: z.string().min(1),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
export type PeopleFilterInput = z.infer<typeof PeopleFilterSchema>;
export type SkillFilterInput = z.infer<typeof SkillFilterSchema>;
export type RoleFilterInput = z.infer<typeof RoleFilterSchema>;
export type CompanyFilterInput = z.infer<typeof CompanyFilterSchema>;
export type RecommendationInput = z.infer<typeof RecommendationSchema>;
export type CareerPathInput = z.infer<typeof CareerPathSchema>;
export type GraphExpandInput = z.infer<typeof GraphExpandSchema>;
