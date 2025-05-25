require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const geminiRoutes = require('./routes/geminiRoutes');

// Debug environment variables
console.log('Environment variables loaded:');
console.log('HF_API_KEY:', process.env.HF_API_KEY ? 'API Key is set' : 'API Key is not set');
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.use('/api', geminiRoutes);

// Serve React app for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.statusCode || 500
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 