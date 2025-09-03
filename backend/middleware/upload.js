import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|tiff|svg|heic|jfif/; 
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith("image/");
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Error: Only image files are allowed!'));
  }
};


const upload = multer({
  storage,
  fileFilter,
});

export default upload;
