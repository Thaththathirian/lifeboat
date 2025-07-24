import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002; // Use port 3002 to avoid conflicts

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost',
    'http://localhost/lifeboat'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for student data (in production, this would be a database)
const studentData = new Map();

// Helper function to get student ID from request
const getStudentId = (req) => {
  // For now, use a default student ID
  // In production, this would come from authentication
  return req.headers['x-student-id'] || 'default-student-123';
};

// Helper function to validate required fields
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(', ')}`
    };
  }
  return { valid: true };
};

// GET Personal Details
app.get('/Student/get_personal_details', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = studentData.get(`${studentId}_personal`);
    
    if (!data) {
      return res.json({
        status: false,
        message: 'No personal details found',
        data: null
      });
    }
    
    res.json({
      status: true,
      message: 'Personal details retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error getting personal details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// POST Personal Details
app.post('/Student/personal_details', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = req.body;
    
    console.log('Received personal details data:', data);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'gender', 'dob', 'street', 'city', 'state', 'pinCode', 'mobile', 'email'];
    const validation = validateRequiredFields(data, requiredFields);
    
    if (!validation.valid) {
      console.log('Validation failed:', validation.error);
      return res.status(400).json({
        status: false,
        message: validation.error,
        data: null
      });
    }
    
    // Store the data
    studentData.set(`${studentId}_personal`, data);
    
    console.log('Personal details saved successfully for student:', studentId);
    
    res.json({
      status: true,
      message: 'Personal details saved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error saving personal details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// GET Family Details
app.get('/Student/get_family_details', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = studentData.get(`${studentId}_family`);
    
    if (!data) {
      return res.json({
        status: false,
        message: 'No family details found',
        data: null
      });
    }
    
    res.json({
      status: true,
      message: 'Family details retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error getting family details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// POST Family Details
app.post('/Student/family_details', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = req.body;
    
    console.log('Received family details data:', data);
    
    // Validate required fields
    const requiredFields = ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'parentsPhone', 'familyAnnualIncome'];
    const validation = validateRequiredFields(data, requiredFields);
    
    if (!validation.valid) {
      console.log('Validation failed:', validation.error);
      return res.status(400).json({
        status: false,
        message: validation.error,
        data: null
      });
    }
    
    // Store the data
    studentData.set(`${studentId}_family`, data);
    
    console.log('Family details saved successfully for student:', studentId);
    
    res.json({
      status: true,
      message: 'Family details saved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error saving family details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// GET Academic Details
app.get('/Student/get_academic_details', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = studentData.get(`${studentId}_academic`);
    
    if (!data) {
      return res.json({
        status: false,
        message: 'No academic details found',
        data: null
      });
    }
    
    res.json({
      status: true,
      message: 'Academic details retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error getting academic details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// POST Academic Details
app.post('/Student/academic_details', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = req.body;
    
    console.log('Received academic details data:', data);
    
    // Validate required fields
    const requiredFields = ['grade', 'academicYear', 'collegeName', 'totalCollegeFees', 'scholarshipAmountRequired'];
    const validation = validateRequiredFields(data, requiredFields);
    
    if (!validation.valid) {
      console.log('Validation failed:', validation.error);
      return res.status(400).json({
        status: false,
        message: validation.error,
        data: null
      });
    }
    
    // Store the data
    studentData.set(`${studentId}_academic`, data);
    
    console.log('Academic details saved successfully for student:', studentId);
    
    res.json({
      status: true,
      message: 'Academic details saved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error saving academic details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// POST Mobile Verification
app.post('/Student/verify_mobile', (req, res) => {
  try {
    const studentId = getStudentId(req);
    const data = req.body;
    
    console.log('Received mobile verification data:', data);
    
    // Validate required fields
    if (!data.firebaseToken) {
      console.log('Validation failed: Missing firebaseToken');
      return res.status(400).json({
        status: false,
        message: 'Missing firebaseToken',
        data: null
      });
    }
    
    // For now, just simulate successful verification
    // In production, this would verify the Firebase token
    console.log('Mobile verification successful for student:', studentId);
    
    res.json({
      status: true,
      message: 'Mobile verification successful',
      data: {
        verified: true,
        studentId: studentId
      }
    });
  } catch (error) {
    console.error('Error verifying mobile:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: true,
    message: 'Student API server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      personal: {
        get: 'GET /lifeboat/Student/get_personal_details',
        post: 'POST /lifeboat/Student/personal_details'
      },
      family: {
        get: 'GET /lifeboat/Student/get_family_details',
        post: 'POST /lifeboat/Student/family_details'
      },
      academic: {
        get: 'GET /lifeboat/Student/get_academic_details',
        post: 'POST /lifeboat/Student/academic_details'
      },
      mobile: {
        post: 'POST /lifeboat/Student/verify_mobile'
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎓 Student API Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost/lifeboat/Student`);
  console.log(`❤️  Health Check: http://localhost/health`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('   GET  /Student/get_personal_details');
  console.log('   POST /Student/personal_details');
  console.log('   GET  /Student/get_family_details');
  console.log('   POST /Student/family_details');
  console.log('   GET  /Student/get_academic_details');
  console.log('   POST /Student/academic_details');
  console.log('   POST /Student/verify_mobile');
  console.log('');
  console.log('💡 To test with curl:');
  console.log('   curl -X GET http://localhost/lifeboat/Student/get_personal_details');
  console.log('   curl -X POST http://localhost/lifeboat/Student/personal_details -H "Content-Type: application/json" -d \'{"firstName":"John","lastName":"Doe"}\'');
  console.log('   curl -X POST http://localhost/lifeboat/Student/verify_mobile -H "Content-Type: application/json" -d \'{"firebaseToken":"test-token"}\'');
}); 