import type { Request, Response } from "express";
import { BadRequestError } from "../utils/AppError.js";
import * as fileService from "../services/file.service.js";

export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        throw new BadRequestError("File not found");
    }

    const file = await fileService.uploadFile(req.file);

    res.status(201).json({
        success: true,
        data: {
            id: file.id,
            url: file.url,
            original_nam: file.original_name
        },
    });
};
