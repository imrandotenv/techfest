import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = process.env.NEON_STORAGE_BUCKET || 'settech-notes';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
}

/**
 * Uploads a file buffer directly to Neon Object Storage (S3-compatible).
 */
export async function uploadToNeonStorage(
  buffer: Buffer,
  filename: string,
  contentType: string = 'application/pdf',
  folder: string = 'notes'
): Promise<UploadResult> {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileKey = `${folder}/${Date.now()}-${cleanFilename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Endpoint format for public_read bucket
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 || '').replace(/\/$/, '');
  const publicUrl = `${endpoint}/${BUCKET_NAME}/${fileKey}`;

  return {
    url: publicUrl,
    key: fileKey,
    bucket: BUCKET_NAME,
    size: buffer.length,
  };
}
