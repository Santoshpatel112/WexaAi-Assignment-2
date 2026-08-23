// 07_recommendations.cypher
// Graph-native 4-hop role match & skill gap traversal

// 4-Hop Query: Candidate -> Skills -> Role -> Company
MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(ps:Skill)
WITH p, collect(DISTINCT ps.id) AS personSkillIds
MATCH (r:Role)-[rs:REQUIRES_SKILL]->(req:Skill)
WITH p, personSkillIds, r,
     collect(DISTINCT req) AS requiredSkills
WITH p, r, requiredSkills,
     [s IN requiredSkills WHERE s.id IN personSkillIds] AS matchedSkills,
     [s IN requiredSkills WHERE NOT s.id IN personSkillIds] AS missingSkills
OPTIONAL MATCH (r)-[:OFFERED_BY]->(c:Company)
RETURN r, matchedSkills, missingSkills, c,
       round(100.0 * size(matchedSkills) / size(requiredSkills)) AS matchPct
ORDER BY matchPct DESC;

// Shortest Path Traversal (Awkward in Relational DBs)
MATCH path = shortestPath(
  (p:Person {id: $personId})-[:HAS_SKILL|RELATED_TO*1..4]->(target:Skill)<-[:REQUIRES_SKILL]-(r:Role {id: $roleId})
)
RETURN path;
