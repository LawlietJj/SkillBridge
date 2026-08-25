const driver = require('../db/connectDb');

async function getAllCareers() {
    const session = driver.session();

    try{
        const result = await session.run(
            `MATCH (c:Career) RETURN c`
        );
         return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
}

module.exports = getAllCareers;