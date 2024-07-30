import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import connectDB from './config/db.js';
import schoolRoutes from './src/routes/schoolRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import authRouter from './src/routes/authendspoints.js';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects', // Folder name in Cloudinary where you want to store uploaded files
    allowed_formats: ['pdf'] // Allowed file formats
    // Add more parameters as needed
  }
});
const upload = multer({ storage: storage });

// Define Routes
app.use('/api/auth', authRouter);
app.use('/api/schools', schoolRoutes);
app.use('/api/projects', projectRoutes);

// Example endpoint to handle file upload
app.post('/upload', upload.single('project_file'), (req, res) => {
  // File upload successful, req.file contains information about the uploaded file
  res.json({ message: 'File uploaded successfully', file: req.file });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
