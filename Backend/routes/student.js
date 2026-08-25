const express = require('express');
const getStudentProfile = require('../queries/student');
const router = express.Router();

router.get('/students/:id', async(req, res) => {
    const { id } = req.params;

    try{
        const student = await getStudentProfile(id);

        if(!student) {
          return res.status(404).json({ error: 'Student not found' });

        } else {
            res.json({ student } );
        }
    }catch (error) {
    res.status(500).json({ error: 'Failed to retrieve student' });
  }

})

module.exports = router;