const driver = require('../db/connectDb');

async function findMentorCoverage(upcomingSkillIds) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (gap:Skill) WHERE gap.id IN $upcomingSkillIds
       MATCH (m:Mentor)-[:EXPERT_IN]->(gap)
       RETURN m.name AS mentorName, collect(gap.name) AS covers, count(gap) AS coverage
       ORDER BY coverage DESC`,
      { upcomingSkillIds }
    );

    return result.records.map(record => ({
      mentorName: record.get('mentorName'),
      covers: record.get('covers'),
      coverage: record.get('coverage').toNumber()
    }));
  } finally {
    await session.close();
  }
}

module.exports = findMentorCoverage;