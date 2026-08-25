const driver = require('../db/connectDb');


async function getAllProjects() {
    const session = driver.session()

    try{
        const result = await session.run(
            `MATCH (p:Project) RETURN p`
        );
        return result.records.map(record => record.get('p').properties);
    } finally {
        await session.close();
    }
}

module.exports = getAllProjects;