import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import statRoutes from './routes/Stat.js';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv to load environment variables
dotenv.config();

// Create an Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Use middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to the database
mongoose.connect("mongodb://localhost:27017/Event", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);  // Exit the process if database connection fails
  });

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/stat', statRoutes);
app.use('/api/user', userRoutes);

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Fallback route for serving files from the uploads folder
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
