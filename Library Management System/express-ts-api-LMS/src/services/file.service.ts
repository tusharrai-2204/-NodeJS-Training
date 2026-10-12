import cloudinary from "../config/cloudinary.js";
import { AppError } from "../utils/AppError.js";
import * as fileRepo from "../repositories/file.repo.js";

export const uploadFile = async (file: Express.Multer.File) => {
  // Build custom filename: originalname (without extension) + timestamp
  const originalNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
  // Sanitize: replace spaces and special chars with underscores
  const sanitized = originalNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const customPublicId = `${sanitized}_${timestamp}`;

  // upload to cloudinary
  const result = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "lms/books", public_id: customPublicId },
        (error, result) => {
          if (error || !result)
            reject(new AppError("Cloudinary upload failed!", 500));
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    },
  );

  // save file information to db
  const fileId = await fileRepo.createFile({
    original_name: file.originalname,
    cloudinary_public_id: result.public_id,
    url: result.secure_url,
    mimetype: file.mimetype,
    size: file.size,
  });

  const savedFile = await fileRepo.findFileById(fileId);
  return savedFile!;
};

export const deleteFileById = async (fileId: number): Promise<void> => {
  const file = await fileRepo.findFileById(fileId);
  if (!file) return;

  // delete from cloudinary also
  await cloudinary.uploader.destroy(file.cloudinary_public_id);

  // delete from db
  await fileRepo.deleteFile(fileId);
};

// url = https://res.cloudinary.com/dnsl8y3zt/image/upload/v1791548053/lms/books/matt-ridley_20261009.jpg
// public_id = lms/books/matt-ridley_20261009
export const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/upload/');
  const afterUpload = parts[1]; // v1791548053/lms/books/matt-ridley_20261009.jpg
  const withoutVersion = afterUpload.replace(/^v\d+\//, ''); // lms/books/matt-ridley_20261009.jpg
  return withoutVersion.replace(/\.[^/.]+$/, ''); // lms/books/matt-ridley_20261009
};

export const uploadImageToCloudinary = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const originalNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
  const sanitized = originalNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const customPublicId = `${sanitized}_${timestamp}`;

  // upload to cloudinary
  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: customPublicId },
        (error, result) => {
          if (error || !result) reject(new AppError("Cloudinary upload failed!", 500));
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    },
  );

  return result.secure_url;
};

export const deleteImageByUrl = async (url: string): Promise<void> => {
  const publicId = extractPublicIdFromUrl(url);
  await cloudinary.uploader.destroy(publicId);
};
