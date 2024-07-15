import { S3Client, PutObjectCommand, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const form = new IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ success: false, message: "Error parsing form data" });
    }

    console.log("Parsed files:", files);
    const fileArray = files.file;

    if (!fileArray || !fileArray[0] || !fileArray[0].filepath) {
      console.error("File path is undefined");
      return res.status(400).json({ success: false, message: "File path is undefined" });
    }

    const file = fileArray[0];

    try {
      const fileContent = await new Promise((resolve, reject) => {
        const chunks = <any>[];
        const stream = fs.createReadStream(file.filepath);
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });

      // Generate a random hash for the file name
      const hash = crypto.randomBytes(16).toString("hex");
      const extension = path.extname(file.originalFilename);
      const fileName = `${hash}${extension}`;

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `public/report_hack/uploads/${fileName}`,
        Body: fileContent,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      console.log("Uploading file to S3...");
      const data = await s3Client.send(new PutObjectCommand(s3Params as PutObjectCommandInput));
      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/public/report_hack/uploads/${fileName}`;
      console.log("File uploaded successfully to S3:", data);
      return res.status(200).json({ success: true, fileUrl });
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return res.status(500).json({ success: false, message: "Error uploading to S3" });
    }
  });
};
