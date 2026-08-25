require ('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Career Path API');
});

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const queriesRoutes = require('./routes/queries');
app.use('/api', queriesRoutes);

const careerRoutes = require('./routes/career');
app.use('/api', careerRoutes);

const projectsRoutes = require('./routes/projects');
app.use('/api', projectsRoutes);

const studentRoutes = require('./routes/student');
app.use('/api', studentRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
