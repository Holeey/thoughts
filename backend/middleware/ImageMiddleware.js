const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now();
    cb(null, newFileName + '_' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only certain file types
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG and PNG files are allowed.'), false); // Reject the file
  }
};

// Set up multer middleware
exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB (adjust as needed)
  }
});