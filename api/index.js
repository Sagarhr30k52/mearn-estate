// api/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware (optional)
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Only use if connecting to Atlas and required
})
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.error('MongoDB connection error ❌:', err));

// Test route
app.get('/', (req, res) => {
  res.send('API is working');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
