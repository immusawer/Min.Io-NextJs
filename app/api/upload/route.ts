import { NextResponse } from 'next/server';
import * as Minio from 'minio';

// Initialize MinIO client
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'admin321'
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const bucketName = 'smh';

    // Check if bucket exists, create if it doesn't
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }

    await minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
      'Content-Type': file.type
    });

    const url = await minioClient.presignedGetObject(bucketName, fileName, 60 * 60 * 24); // URL expires in 24 hours

    return NextResponse.json({ 
      success: true, 
      url,
      fileName 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 