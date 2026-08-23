# CareerGraph — Graph Data Model Documentation

## Node Types

- **Person**: `id`, `name`, `email`, `title`, `location`, `experienceYears`, `bio`, `createdAt`
- **Skill**: `id`, `name`, `category`, `difficulty`, `description`
- **Project**: `id`, `name`, `description`, `category`, `githubUrl`, `demoUrl`, `year`
- **Role**: `id`, `title`, `description`, `level`, `salaryRange`
- **Company**: `id`, `name`, `industry`, `location`, `website`
- **LearningResource**: `id`, `title`, `type`, `url`, `provider`, `difficulty`

## Relationship Types

```mermaid
graph TD
  Person[Person Node] -->|HAS_SKILL| Skill[Skill Node]
  Person -->|WORKED_ON| Project[Project Node]
  Person -->|TARGETS| Role[Role Node font-weight:bold]
  Project -->|USES_SKILL| Skill
  Role -->|REQUIRES_SKILL| Skill
  Role -->|OFFERED_BY| Company[Company Node]
  Skill -->|RELATED_TO| Skill
  Skill -->|HAS_RESOURCE| Resource[LearningResource Node]
  Company -->|HIRING_FOR| Role
```
