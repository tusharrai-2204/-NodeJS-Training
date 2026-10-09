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
