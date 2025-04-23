import { Injectable } from '@nestjs/common';
import { cloudinaryConfig } from '../utilities/cloudinary.js';
import { UploadApiOptions } from 'cloudinary';

type UpdateTypes = {
  newFile: Express.Multer.File;
  oldFile?: string;
  path: string;
  customId: string | null;
};

@Injectable()
export class FileUploadService {
  constructor() {}
  private _cloudinary = cloudinaryConfig();

  async uploadFile(file: Express.Multer.File, options: UploadApiOptions) {
    return await this._cloudinary.uploader.upload(file.path, options);
  }

  async uploadFiles(files: Express.Multer.File[], options: UploadApiOptions) {
    const results: { secure_url: string; public_id: string }[] = [];

    for (const file of files) {
      const { secure_url, public_id } = await this.uploadFile(file, options);
      results.push({ secure_url, public_id });
    }

    return results;
  }

  async deleteFile(public_id: string) {
    return await this._cloudinary.uploader.destroy(public_id);
  }

  async deleteFolder(filePath: string) {
    await this._cloudinary.api.delete_resources_by_prefix(filePath);
    return await this._cloudinary.api.delete_folder(filePath);
  }

  async updateFile({ newFile, oldFile, path, customId }: UpdateTypes) {
    if (oldFile) {
      await this.deleteFile(oldFile);
    }

    if (!customId) customId = Math.random().toString(36).substring(2, 7);

    const folder = customId ? `${path}/${customId}` : path;

    const { secure_url, public_id } = await this.uploadFile(newFile, {
      folder,
    });

    return { secure_url, public_id, customId: customId ? customId : null };
  }
}
