import { NextResponse } from 'next/server';
import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'admin321'
});

export async function GET() {
  try {
    const bucketName = 'smh';
    const images = [];

    // List all objects in the bucket
    const stream = minioClient.listObjects(bucketName, '', true);
    
    for await (const obj of stream) {
      if (obj.name) {
        const url = await minioClient.presignedGetObject(bucketName, obj.name, 60 * 60 * 24);
        images.push({
          name: obj.name,
          url,
          lastModified: obj.lastModified,
          size: obj.size
        });
      }
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
} 