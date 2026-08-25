const express = require('express');
const getAllCareers = require('../queries/career');
const router = express.Router();


router.get('/careers', async (req, res) => {

    try{
        const careers = await getAllCareers();
        res.json({ careers });
    } catch(error) {
        res.status(500).json({ error: 'Failed to retrieve careers' });
    }
})

module.exports = router;