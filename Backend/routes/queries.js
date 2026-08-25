const express = require('express');
const findPathToGoal = require('../queries/pathToGoal');
const findMentorCoverage = require('../queries/mentorCoverage');
const router = express.Router();

router.get('/path-to-goal', async (req, res) => {
  const { studentId, careerName } = req.query;

  if (!studentId || !careerName) {
    return res.status(400).json({ error: 'studentId and careerName are required' });
  }

  try {
    const paths = await findPathToGoal(studentId, careerName);
    res.json({ paths });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find path to goal' });
  }
});

router.get('/mentor-coverage', async (req, res) => {
  const { skillIds } = req.query;

  if (!skillIds) {
    return res.status(400).json({ error: 'skillIds is required (comma-separated)' });
  }

  const upcomingSkillIds = skillIds.split(',');
  try {
    const mentors = await findMentorCoverage(upcomingSkillIds);
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find mentor coverage' });
  }
});

module.exports = router;