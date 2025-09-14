import multer from "multer";

const storage = multer.memoryStorage();
const maxFileSize = 10 * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
});

export default upload;
