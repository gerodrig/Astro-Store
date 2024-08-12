import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export class ImageUpload {
  static async upload(file: File) {
    try {
      const buffer = await file.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      const imageType = file.type.split('/')[1];

      const response = await cloudinary.uploader.upload(
        `data:image/${imageType};base64,${base64Image}`
      );

      return response.secure_url;
    } catch (error) {
      console.error(error);
      throw new Error(JSON.stringify(error));
    }
  }

  static async delete(image: string) {
    try {
      const publicId = image.split('/').pop()?.split('.')[0];
      if (!publicId) return;
      await cloudinary.uploader.destroy(publicId);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
