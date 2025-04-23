import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

interface MultipleOptions {
  allowExtensions: {
    [fieldName: string]: string[];
  };
}

export const multerConfig = ({ allowExtensions }: MultipleOptions) => {
  const storage = diskStorage({});

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, file: boolean) => void,
  ) => {
    const allowed = allowExtensions[file.fieldname];

    if (!allowed?.includes(file.mimetype)) {
      return cb(new BadRequestException('Only image file is allowed'), false);
    }

    cb(null, true);
  };

  return { storage, fileFilter };
};
