# SkillBridge

A personalized learning and career-path platform. A student picks a career goal, and SkillBridge computes a prerequisite skill path, ranks mentors by how much of that path they can cover, and lists projects that help students prove skills through practical work.

Built for the Wexa AI take-home assignment using **CognoDB**, a managed graph database that is Neo4j/openCypher-compatible.

## Table Of Contents

- [Why A Graph Database?](#why-a-graph-database)
- [Data Model](#data-model)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup And Run Instructions](#setup-and-run-instructions)
- [Main Queries Explained](#main-queries-explained)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)

## Why A Graph Database?

SkillBridge's core question is: **"Given what I already know, what skills connect me to my goal career, who can teach those skills, and what projects can help me practice?"**

This is a relationship-heavy problem, which makes it a strong fit for a graph database:

- **Variable-length prerequisite chains.** Skills chain into each other, such as `Python -> Pandas -> Statistics -> Machine Learning`. In Cypher, this can be expressed with a variable-length traversal: `(known)-[:PREREQUISITE_OF*1..5]->(goal)`.
- **Skills are shared across careers.** One skill can support several career paths without needing new join-table logic for each path.
- **Mentor ranking depends on graph coverage.** Mentor recommendations are based on how many of the student's remaining path skills each mentor covers.

A relational database could model this with join tables and recursive queries, but graph traversal makes the core product logic easier to express and reason about.

## Data Model

**Nodes**

| Label | Key Properties |
|---|---|
| `Student` | `id`, `name`, `email`, `passwordHash` |
| `Mentor` | `id`, `name`, `bio`, `email`, `passwordHash` |
| `Skill` | `id`, `name`, `category` |
| `Career` | `id`, `name`, `description` |
| `Project` | `id`, `title`, `description` |

**Relationships**

| Relationship | Direction | Notes |
|---|---|---|
| `KNOWS` | `(Student)-[:KNOWS {level}]->(Skill)` | Student's current skills |
| `INTERESTED_IN` | `(Student)-[:INTERESTED_IN]->(Career)` | Student's career interest |
| `PREREQUISITE_OF` | `(Skill)-[:PREREQUISITE_OF]->(Skill)` | Earlier skill -> later skill |
| `REQUIRED_FOR` | `(Skill)-[:REQUIRED_FOR]->(Career)` | Skill required for a career |
| `EXPERT_IN` | `(Mentor)-[:EXPERT_IN {years}]->(Skill)` | Mentor's teachable skills |
| `TEACHES` | `(Project)-[:TEACHES]->(Skill)` | Skill a project reinforces |
| `LEADS_TO` | `(Project)-[:LEADS_TO]->(Career)` | Career a project supports |

Example Data Scientist chain:

```text
Python -> Pandas -> Statistics -> Machine Learning -> Data Scientist
```

Seed data includes 26 skills, 8 careers, 5 mentors, 3 students, and 5 projects.

## Features

- **Auth**: email/password signup and login using bcrypt password hashing and JWT session tokens.
- **Dashboard**: fetches the student's profile with `GET /api/students/:id`, displays known skills, and loads career options with `GET /api/careers`.
- **Skill Path**: fetches `GET /api/path-to-goal?studentId=...&careerName=...` and renders the returned skill chain.
- **Mentors**: uses the selected career, fetches the skill path, removes already-known starting skills, converts remaining skill names to skill IDs, and calls `GET /api/mentor-coverage?skillIds=...`.
- **Projects**: fetches `GET /api/projects` and displays the seeded project library.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express |
| Database | CognoDB using the official `neo4j-driver` |
| Auth | `bcryptjs`, `jsonwebtoken` |

## Setup And Run Instructions

### 1. Create A CognoDB Instance

1. Create a CognoDB account.
2. Create a free instance.
3. Copy the connection URI, username, and password.

### 2. Install Dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

### 3. Configure Environment Variables

Create or update `Backend/.env`:

```env
COGNODB_URI=bolt+s://your-instance-id.databases.cognodb.cloud
COGNODB_USER=cognodb
COGNODB_PASSWORD=your-password
JWT_SECRET=any-long-random-string
PORT=3000
```

Create or update `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Seed The Database

From `Backend/`:

```bash
node seed/seed.js
```

To wipe the database:

```bash
node seed/clean.js
```

To verify seeded data:

```bash
node seed/verify.js
```

### 5. Run The App

Backend:

```bash
cd Backend
node app.js
```

The API runs on `http://localhost:3000`.

Frontend:

```bash
cd Frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 6. Demo Login

Use this seeded student account:

```text
Email: chidi@example.com
Password: password123
```

## Main Queries Explained

### Prerequisite Path To Career Goal

```cypher
MATCH (s:Student {id: $studentId})-[:KNOWS]->(known:Skill),
      (career:Career {name: $careerName})<-[:REQUIRED_FOR]-(goal:Skill),
      path = (known)-[:PREREQUISITE_OF*1..5]->(goal)
RETURN path
```

This starts from the skills a student already knows and walks through prerequisite relationships until it reaches a skill required for the selected career.

### Mentor Coverage Ranking

```cypher
MATCH (gap:Skill) WHERE gap.id IN $upcomingSkillIds
MATCH (m:Mentor)-[:EXPERT_IN]->(gap)
RETURN m.name AS mentorName, collect(gap.name) AS covers, count(gap) AS coverage
ORDER BY coverage DESC
```

This ranks mentors by how many upcoming path skills they can teach.

## Project Structure

```text
SkillBridge/
|-- Backend/
|   |-- app.js
|   |-- db/
|   |-- queries/
|   |-- routes/
|   |-- seed/
|   |-- package.json
|   `-- .env
|
|-- Frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- Components/
|   |   |-- Pages/
|   |   `-- Services/
|   |-- public/
|   |-- package.json
|   `-- .env
|
`-- README.md
```

## Screenshots

**Login**
![Login page](screenshots/login.png)

**Dashboard**
![Dashboard](screenshots/dashboard.png)

**Skill Path**
![Skill path chain](screenshots/skill-path.png)

**Mentors**
![Mentor ranking](screenshots/mentors.png)

**Projects**
![Projects list](screenshots/projects.png)

## Known Limitations

- Seed data is intentionally small and designed for demonstration.
- Skill paths are currently limited to prerequisite traversals between 1 and 5 hops.
- Projects are shown as a general library, not yet filtered by selected career or student skill path.
- Auth is intentionally minimal and does not include password reset or email verification.
- The selected career is persisted in `localStorage` so Skill Path and Mentors can still work after navbar navigation.
