require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./db/schema');
const { seedAdmin } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Init DB and Seed
setupDatabase();
seedAdmin();

// Routes
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
