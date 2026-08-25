const driver = require('../db/connectDb');


async function getAllProjects() {
    const session = driver.session()

    try{
        const result = await session.run(
            `MATCH (p:Project)
             OPTIONAL MATCH (p)-[:TEACHES]->(skill:Skill)
             RETURN p, collect(DISTINCT skill.name) AS skills
             ORDER BY p.id`
        );
        return result.records.map(record => ({
            ...record.get('p').properties,
            skills: record.get('skills').filter(Boolean)
        }));
    } finally {
        await session.close();
    }
}

module.exports = getAllProjects;
