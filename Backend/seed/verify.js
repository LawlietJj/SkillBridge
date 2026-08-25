require('dotenv').config();
const driver = require('../db/connectDb');

async function verify() {
  const session = driver.session();
  try {
    const nodeCount = await session.run(
      'MATCH (n) RETURN labels(n) AS label, count(n) AS count'
    );
    nodeCount.records.forEach(r => {
      console.log(r.get('label'), '-', r.get('count').toNumber());
    });

    const relCount = await session.run(
      'MATCH ()-[r]->() RETURN type(r) AS relType, count(r) AS count'
    );
    relCount.records.forEach(r => {
      console.log(r.get('relType'), '-', r.get('count').toNumber());
    });
  } catch (error) {
    console.error('Verify failed:', error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

verify();