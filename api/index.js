// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import postRoutes from './routes/posts.js';
import AuthRoutes from './routes/auth.js';


// Configure environment variables
dotenv.config();
const port = process.env.PORT || 8800;

// Create Express app
const app = express();

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Serve static files from client's public directory
app.use('/uploads', express.static(path.join(__dirname, '../client/public/uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', AuthRoutes);

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../client/public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.match(/^image\/(jpe?g|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Use relative path for client access
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: filePath });
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Upload directory: ${path.join(__dirname, '../client/public/uploads')}`);
});