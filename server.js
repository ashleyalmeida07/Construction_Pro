const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Import models so Sequelize registers them (important for associations)
require('./models/User');
require('./models/Project');
require('./models/DailyReport');

const app = express();
app.use(cors()); 
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));
app.use('/projects/:id/dpr', require('./routes/dpr'));

app.get('/', (req, res) => {
  res.json({ message: 'Construction API is running!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('✅ Database connected and tables synced.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });
