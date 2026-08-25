require ("dotenv").config();
const driver = require('../db/connectDb');

const skills = [
    { id: 'html-css', name: 'HTML/CSS', category: 'Web' },
    { id: 'javascript', name: 'JavaScript', category: 'Programming' },
    { id: 'python', name: 'Python', category: 'Programming' },
    { id: 'nodejs', name: 'Node.js', category: 'Backend' },
    { id: 'react', name: 'React', category: 'Web' },
    { id: 'dart', name: 'Dart', category: 'Programming' },
    { id: 'flutter', name: 'Flutter', category: 'Mobile' },
    { id: 'databases', name: 'Databases', category: 'Backend' },
    { id: 'system-design', name: 'System Design', category: 'Architecture' },
    { id: 'web-performance', name: 'Web Performance', category: 'Web' },
    { id: 'pandas', name: 'Pandas', category: 'Data' },
    { id: 'statistics', name: 'Statistics', category: 'Data' },
    { id: 'machine-learning', name: 'Machine Learning', category: 'AI' },
    { id: 'deep-learning', name: 'Deep Learning', category: 'AI' },
    { id: 'nlp', name: 'NLP', category: 'AI' },
    { id: 'linux', name: 'Linux', category: 'Systems' },
    { id: 'networking', name: 'Networking', category: 'Systems' },
    { id: 'docker', name: 'Docker', category: 'DevOps' },
    { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps' },
    { id: 'cloud-fundamentals', name: 'Cloud Fundamentals', category: 'Cloud' },
    { id: 'aws-azure', name: 'AWS/Azure', category: 'Cloud' },
    { id: 'mobile-architecture', name: 'Mobile Architecture', category: 'Mobile' },
    { id: 'git', name: 'Git', category: 'Tools' },
    { id: 'data-structures', name: 'Data Structures', category: 'CS Fundamentals' },
    { id: 'algorithms', name: 'Algorithms', category: 'CS Fundamentals' },
    { id: 'sql', name: 'SQL', category: 'Data' }
];

const careers = [
  { id: 'data-scientist', name: 'Data Scientist', description: 'Extracts insights from data using statistics and ML.' },
  { id: 'backend-engineer', name: 'Backend Engineer', description: 'Builds server-side systems and APIs.' },
  { id: 'frontend-engineer', name: 'Frontend Engineer', description: 'Builds user-facing web interfaces.' },
  { id: 'ai-engineer', name: 'AI Engineer', description: 'Builds and deploys AI/ML models.' },
  { id: 'devops-engineer', name: 'DevOps Engineer', description: 'Manages infrastructure and deployment pipelines.' },
  { id: 'mobile-developer', name: 'Mobile Developer', description: 'Builds mobile apps with Flutter.' },
  { id: 'cloud-engineer', name: 'Cloud Engineer', description: 'Designs and manages cloud infrastructure.' },
  { id: 'full-stack-engineer', name: 'Full Stack Engineer', description: 'Builds both frontend and backend systems.' }
];
const bcrypt = require('bcryptjs');

const mentors = [
  { id: 'mentor-1', name: 'Sarah Chen', bio: 'Data science mentor with 8 years in industry.', email: 'sarah@skillbridge.com', password: 'password123' },
  { id: 'mentor-2', name: 'David Kim', bio: 'Backend engineer, loves teaching Node.js.', email: 'david@skillbridge.com', password: 'password123' },
  { id: 'mentor-3', name: 'Amina Yusuf', bio: 'Frontend specialist, React and performance.', email: 'amina@skillbridge.com', password: 'password123' },
  { id: 'mentor-4', name: 'John Okafor', bio: 'ML engineer, deep learning and NLP.', email: 'john@skillbridge.com', password: 'password123' },
  { id: 'mentor-5', name: 'Grace Lin', bio: 'DevOps mentor, Kubernetes and cloud.', email: 'grace@skillbridge.com', password: 'password123' }
];

const students = [
  { id: 'student-1', name: 'Chidi Obi', email: 'chidi@example.com', password: 'password123' },
  { id: 'student-2', name: 'Fatima Bello', email: 'fatima@example.com', password: 'password123' },
  { id: 'student-3', name: 'Tunde Ade', email: 'tunde@example.com', password: 'password123' }
];

const projects = [
  { id: 'project-1', title: 'Sales Data Dashboard', description: 'Analyze sales data using Pandas and visualize trends.' },
  { id: 'project-2', title: 'REST API for a Blog', description: 'Build a Node.js/Express API with a database backend.' },
  { id: 'project-3', title: 'Personal Portfolio Site', description: 'A responsive React site showcasing projects.' },
  { id: 'project-4', title: 'Image Classifier', description: 'Train a deep learning model to classify images.' },
  { id: 'project-5', title: 'CI/CD Pipeline Demo', description: 'Set up Docker + Kubernetes deployment pipeline.' }
];

async function seedSkillsAndCareers() {
    const session = driver.session();

    try {
        for (const skill of skills) {
            await session.run(
                'MERGE (s:Skill {id: $id}) SET s.name = $name, s.category = $category',
                skill
            );
            console.log(`Created skill: ${skill.name}`);
        }

        for (const career of careers) {
            await session.run(
                'MERGE (c:Career {id: $id}) SET c.name = $name, c.description = $description',
                career
            );
             console.log(`Created career: ${career.name}`);
        }

        console.log('Skills and careers seeded successfully.');

    } catch(error){
         console.error('Seeding failed:', error.message);
    } finally {
        await session.close();
        
    }
}


const prerequisites = [
  // Data Scientist chain
  { from: 'python', to: 'pandas' },
  { from: 'pandas', to: 'statistics' },
  { from: 'statistics', to: 'machine-learning' },

  // AI Engineer chain (branches off machine-learning)
  { from: 'machine-learning', to: 'deep-learning' },
  { from: 'deep-learning', to: 'nlp' },

  // Backend Engineer chain
  { from: 'javascript', to: 'nodejs' },
  { from: 'nodejs', to: 'databases' },
  { from: 'databases', to: 'system-design' },

  // Frontend Engineer chain
  { from: 'html-css', to: 'javascript' },
  { from: 'javascript', to: 'react' },
  { from: 'react', to: 'web-performance' },

  // DevOps Engineer chain
  { from: 'linux', to: 'networking' },
  { from: 'networking', to: 'docker' },
  { from: 'docker', to: 'kubernetes' },

  // Mobile Developer chain
  { from: 'dart', to: 'flutter' },
  { from: 'flutter', to: 'mobile-architecture' },

  // Cloud Engineer chain
  { from: 'linux', to: 'cloud-fundamentals' },
  { from: 'cloud-fundamentals', to: 'aws-azure' },

  // Full Stack Engineer chain 
  { from: 'javascript', to: 'nodejs' },
  { from: 'nodejs', to: 'react' },
  { from: 'react', to: 'databases' }
];

const requiredForCareer = [
  { skill: 'machine-learning', career: 'data-scientist' },
  { skill: 'system-design', career: 'backend-engineer' },
  { skill: 'web-performance', career: 'frontend-engineer' },
  { skill: 'nlp', career: 'ai-engineer' },
  { skill: 'kubernetes', career: 'devops-engineer' },
  { skill: 'mobile-architecture', career: 'mobile-developer' },
  { skill: 'aws-azure', career: 'cloud-engineer' },
  { skill: 'databases', career: 'full-stack-engineer' }
];

async function seedPrerequisites() {
  const session = driver.session();
  try {
    for (const rel of prerequisites) {
      await session.run(
        `MATCH (a:Skill {id: $from}), (b:Skill {id: $to})
         MERGE (a)-[:PREREQUISITE_OF]->(b)`,
        rel
      );
      console.log(`Linked: ${rel.from} → ${rel.to}`);
    }
    console.log('Prerequisites seeded.');
  } catch (error) {
    console.error('Prerequisite seeding failed:', error.message);
  } finally {
    await session.close();
  }
}

async function seedRequiredForCareer() {
  const session = driver.session();
  try {
    for (const rel of requiredForCareer) {
      await session.run(
        `MATCH (s:Skill {id: $skill}), (c:Career {id: $career})
         MERGE (s)-[:REQUIRED_FOR]->(c)`,
        rel
      );
      console.log(`Linked: ${rel.skill} → ${rel.career}`);
    }
    console.log('Required-for-career links seeded.');
  } catch (error) {
    console.error('Required-for seeding failed:', error.message);
  } finally {
    await session.close();
  }
}
async function seedMentorsStudentsProjects() {
  const session = driver.session();
  try {
    for (const mentor of mentors) {
      const passwordHash = await bcrypt.hash(mentor.password, 10);
      await session.run(
        `MERGE (m:Mentor {id: $id})
         SET m.name = $name, m.bio = $bio, m.email = $email, m.passwordHash = $passwordHash`,
        { id: mentor.id, name: mentor.name, bio: mentor.bio, email: mentor.email, passwordHash }
      );
      console.log(`Created mentor: ${mentor.name}`);
    }

    for (const student of students) {
      const passwordHash = await bcrypt.hash(student.password, 10);
      await session.run(
        `MERGE (s:Student {id: $id})
         SET s.name = $name, s.email = $email, s.passwordHash = $passwordHash`,
        { id: student.id, name: student.name, email: student.email, passwordHash }
      );
      console.log(`Created student: ${student.name}`);
    }

    for (const project of projects) {
      await session.run(
        `MERGE (p:Project {id: $id})
         SET p.title = $title, p.description = $description`,
        project
      );
      console.log(`Created project: ${project.title}`);
    }

    console.log('Mentors, students, and projects seeded.');
  } catch (error) {
    console.error('Mentor/student/project seeding failed:', error.message);
  } finally {
    await session.close();
  }
}


const studentKnows = [
  { student: 'student-1', skill: 'python', level: 'intermediate' },
  { student: 'student-1', skill: 'html-css', level: 'beginner' },
  { student: 'student-2', skill: 'javascript', level: 'intermediate' },
  { student: 'student-2', skill: 'git', level: 'advanced' },
  { student: 'student-3', skill: 'linux', level: 'beginner' },
  { student: 'student-3', skill: 'networking', level: 'intermediate' }
];

const mentorExpertise = [
  { mentor: 'mentor-1', skill: 'pandas', years: 6 },
  { mentor: 'mentor-1', skill: 'statistics', years: 5 },
  { mentor: 'mentor-1', skill: 'machine-learning', years: 4 },
  { mentor: 'mentor-2', skill: 'nodejs', years: 7 },
  { mentor: 'mentor-2', skill: 'databases', years: 6 },
  { mentor: 'mentor-3', skill: 'react', years: 5 },
  { mentor: 'mentor-3', skill: 'web-performance', years: 4 },
  { mentor: 'mentor-4', skill: 'deep-learning', years: 5 },
  { mentor: 'mentor-4', skill: 'nlp', years: 3 },
  { mentor: 'mentor-5', skill: 'docker', years: 6 },
  { mentor: 'mentor-5', skill: 'kubernetes', years: 4 }
];

const studentInterests = [
  { student: 'student-1', career: 'data-scientist' },
  { student: 'student-2', career: 'backend-engineer' },
  { student: 'student-2', career: 'full-stack-engineer' },
  { student: 'student-3', career: 'devops-engineer' }
];

const projectTeaches = [
  { project: 'project-1', skill: 'pandas' },
  { project: 'project-2', skill: 'nodejs' },
  { project: 'project-2', skill: 'databases' },
  { project: 'project-3', skill: 'react' },
  { project: 'project-4', skill: 'deep-learning' },
  { project: 'project-5', skill: 'docker' },
  { project: 'project-5', skill: 'kubernetes' }
];

const projectLeadsTo = [
  { project: 'project-1', career: 'data-scientist' },
  { project: 'project-2', career: 'backend-engineer' },
  { project: 'project-3', career: 'frontend-engineer' },
  { project: 'project-4', career: 'ai-engineer' },
  { project: 'project-5', career: 'devops-engineer' }
];

async function seedStudentKnows() {
  const session = driver.session();
  try {
    for (const rel of studentKnows) {
      await session.run(
        `MATCH (s:Student {id: $student}), (k:Skill {id: $skill})
         MERGE (s)-[:KNOWS {level: $level}]->(k)`,
        rel
      );
      console.log(`Linked: ${rel.student} knows ${rel.skill}`);
    }
    console.log('Student-Skill relationships seeded.');
  } catch (error) {
    console.error('Student-Skill seeding failed:', error.message);
  } finally {
    await session.close();
  }
}

async function seedMentorExpertise() {
    const session = driver.session()

    try {
        for (const rel of mentorExpertise) {
            await session.run(
                'MATCH (m:Mentor {id: $mentor}), (s:Skill {id: $skill}) MERGE (m)-[:EXPERT_IN {years: $years}]->(s)',
                rel
            );
        }
    } catch (error) {
        console.error('Mentor-Skill seeding failed:', error.message);
    } finally {
        await session.close();
    }
}

async function seedStudentIntrest() {
    const session = driver.session();
    try{
        for (const rel of studentInterests) {
                await session.run(
                'MATCH (s:Student {id: $student}), (c:Career {id: $career}) MERGE (s)-[:INTERESTED_IN]->(c)',
                rel 
            );
        }

    } catch (error) {
         console.error('Mentor-Skill seeding failed:', error.message);
    } finally {
        await session.close();
    }
}

async function seedProjectTeaches() {
    const session =driver.session();

    try{
        for(const rel of projectTeaches) {
                await session.run(
                'MATCH (p:Project {id: $project}), (s:Skill {id: $skill}) MERGE (p)-[:TEACHES]->(s)',
                rel
            );
        }
    } catch(error) {
        console.error('Mentor-Skill seeding failed:', error.message);
    } finally{
        await session.close();
    }
}

async function seedProjectLeadsTo() {
    const session = driver.session();

    try {
        for(const rel of projectLeadsTo) {
            await session.run(
            'MATCH (p:Project {id: $project}), (c:Career {id: $career}) MERGE (p)-[:LEADS_TO]->(c)',rel
          );
        }
    } catch(error) {
        console.error('Mentor-Skill seeding failed:', error.message);
    } finally {
        await session.close();
    }

}  

async function runSeed() {
  await seedSkillsAndCareers();
  await seedPrerequisites();
  await seedRequiredForCareer();
  await seedMentorsStudentsProjects();
  await seedStudentKnows();
  await seedMentorExpertise();
  await seedStudentIntrest();
  await seedProjectTeaches();
  await seedProjectLeadsTo();
  await driver.close();
}

runSeed();