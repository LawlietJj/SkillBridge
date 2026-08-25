
const driver = require('../db/connectDb');

async function findPathToGoal(studentId, careerName) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (s:Student {id: $studentId})-[:KNOWS]->(known:Skill),
             (career:Career {name: $careerName})<-[:REQUIRED_FOR]-(goal:Skill),
             path = (known)-[:PREREQUISITE_OF*1..5]->(goal)
       RETURN path`,
      { studentId, careerName }
    );

    return result.records.map(record => {
      const path = record.get('path');
      return path.segments.map(seg => seg.start.properties.name)
        .concat(path.end.properties.name);
    });
  } finally {
    await session.close();
  }
}

module.exports = findPathToGoal;