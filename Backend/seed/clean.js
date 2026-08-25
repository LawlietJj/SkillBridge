require ("dotenv").config();
const driver = require('../db/connectDb')

async function cleanDatabase() {
  const session = driver.session();
  try {
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('Database cleaned — all nodes and relationships removed.');
  } catch (error) {
    console.error('Cleanup failed:', error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

cleanDatabase();