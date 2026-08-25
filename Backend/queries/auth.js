const driver = require('../db/connectDb');
const bcrypt = require('bcryptjs');

async function findUserByEmail(email) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u) WHERE (u:Student OR u:Mentor) AND u.email = $email
       RETURN u, labels(u) AS labels`,
      { email }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const user = record.get('u').properties;
    const labels = record.get('labels');
    const role = labels.includes('Student') ? 'student' : 'mentor';

    return { ...user, role };
  } finally {
    await session.close();
  }
}

async function createStudent({ id, name, email, password }) {
  const session = driver.session();
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await session.run(
      `CREATE (s:Student {id: $id, name: $name, email: $email, passwordHash: $passwordHash})
       RETURN s`,
      { id, name, email, passwordHash }
    );
    return result.records[0].get('s').properties;
  } finally {
    await session.close();
  }
}

module.exports = { findUserByEmail, createStudent };