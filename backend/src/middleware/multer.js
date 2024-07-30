import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Function to ensure directory exists, creating it if necessary
async function ensureDir(directory) {
  try {
    await fs.promises.access(directory, fs.constants.F_OK);
  } catch (e) {
    if (e.code === 'ENOENT') {
      await fs.promises.mkdir(directory, { recursive: true });
    } else {
      throw e; // Throw any other error
    }
  }
}

// Configure multer disk storage
export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = "images_container";
    await ensureDir(dir); // Ensure directory exists before saving file
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

// Initialize multer upload with the configured storage
const upload = multer({ storage: storage });

// Define uploaded fields configuration
export const uploaded = upload.fields([
  { name: "project_file", maxCount: 1 },
  { name: "image", maxCount: 4 },
  { name: "images", maxCount: 20 }
]);
