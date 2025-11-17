import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const storage = multer.memoryStorage();
export const uploadImages = multer({ storage }).array("images", 10);
export const uploadSingle = multer({ storage }).single("image");

export const uploadAndCompress = async (req, res, next) => {
  try {
    if (!req.files && !req.file) return next();

    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Dynamic base URL - Environment variable ya request se
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    if (req.files) {
      req.body.images = await Promise.all(
        req.files.map(async (file) => {
          const filename = `${Date.now()}-${file.originalname}.webp`;
          const outputPath = path.join(uploadsDir, filename);

          await sharp(file.buffer).webp({ quality: 70 }).toFile(outputPath);

          return `${baseUrl}/uploads/${filename}`;
        })
      );
    }

    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}.webp`;
      const outputPath = path.join(uploadsDir, filename);

      await sharp(req.file.buffer).webp({ quality: 70 }).toFile(outputPath);

      req.body.image = `${baseUrl}/uploads/${filename}`;
    }

    console.log("Processed images with full URLs:", req.body.images);
    next();
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  }
};
