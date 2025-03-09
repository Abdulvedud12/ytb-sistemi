require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ytb_applications', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Import Application model
const Application = require('./models/Application');

// Validation middleware
const validateApplication = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('birthDate').isISO8601().withMessage('Valid date of birth is required'),
    body('nationality').trim().notEmpty().withMessage('Nationality is required'),
    body('passportNumber').trim().notEmpty().withMessage('Passport number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('educationLevel').isIn(['highSchool', 'bachelor', 'master', 'phd']).withMessage('Valid education level is required'),
    body('university').trim().notEmpty().withMessage('Institution name is required'),
    body('graduationYear').isInt({ min: 1950, max: new Date().getFullYear() }).withMessage('Valid graduation year is required'),
    body('gpa').isFloat({ min: 0, max: 4 }).withMessage('Valid GPA is required')
];

// Routes
app.post('/api/applications', 
    upload.fields([
        { name: 'passportCopy', maxCount: 1 },
        { name: 'diploma', maxCount: 1 },
        { name: 'transcripts', maxCount: 1 },
        { name: 'letterOfIntent', maxCount: 1 }
    ]),
    validateApplication,
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Process file uploads
            const documents = {};
            for (const [fieldName, files] of Object.entries(req.files)) {
                const file = files[0];
                documents[fieldName] = {
                    filename: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype
                };
            }

            // Create new application
            const application = new Application({
                ...req.body,
                documents
            });

            // Save application
            await application.save();

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationNumber: application.applicationNumber
            });

        } catch (error) {
            console.error('Application submission error:', error);
            res.status(500).json({
                message: 'Error submitting application',
                error: error.message
            });
        }
    }
);

// Get application status
app.get('/api/applications/:applicationNumber', async (req, res) => {
    try {
        const application = await Application.findOne({
            applicationNumber: req.params.applicationNumber
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({
            applicationNumber: application.applicationNumber,
            status: application.status,
            submittedAt: application.submittedAt,
            lastUpdated: application.lastUpdated
        });

    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            message: 'Error fetching application status',
            error: error.message
        });
    }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 