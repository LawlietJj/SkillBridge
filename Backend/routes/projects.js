const express = require('express');
const getAllProjects = require('../queries/projects');
const router = express.Router();

router.get('/projects', async (req, res ) => {
   
    try{
        const projects = await getAllProjects();
        res.json({ projects });
    }  catch(error) {
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }

})

module.exports  = router;