import type { Request } from "express";
import multer from "multer";
import { BadRequestError } from "../utils/AppError.js";

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 2*1024*1024;

export const uploadFileMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (_req: Request, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError(`Invalid file type: ${file.mimetype}. Please provide a JPEG, JPG or PNG image.`));
    }
  }
}).single('file');