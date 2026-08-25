const driver = require('../db/connectDb');

async function getStudentProfile(studentId) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (s:Student {id: $studentId})
       OPTIONAL MATCH (s)-[k:KNOWS]->(skill:Skill)
       OPTIONAL MATCH (s)-[:INTERESTED_IN]->(career:Career)
       RETURN s,
              collect(DISTINCT {name: skill.name, level: k.level}) AS knownSkills,
              collect(DISTINCT career.name) AS interests`,
      { studentId }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const { passwordHash, ...safeProperties } = record.get('s').properties;
    return {
      ...safeProperties,
      knownSkills: record.get('knownSkills'),
      interests: record.get('interests')
    };
  } finally {
    await session.close();
  }
}

module.exports = getStudentProfile;