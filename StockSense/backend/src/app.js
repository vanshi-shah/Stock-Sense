const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/users', require('./routes/user.routes'));

// Default Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend Boilerplate API is running' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
