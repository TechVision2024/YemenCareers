import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";

export const multerConfig: MulterModuleOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = /\/(jpg|jpeg|png)$/;
        if (!file.mimetype.match(allowedMimeTypes)) {
            return cb(new Error('Invalid file type. Only JPG, JPEG, PNG are allowed.'), false);
        }
        cb(null, true)
    }
}
