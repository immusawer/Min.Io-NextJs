'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface Image {
  name: string;
  url: string;
  lastModified: Date;
  size: number;
}

export default function ImageManager() {
  const [images, setImages] = useState<Image[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      if (response.ok) {
        setImages(data.images);
      } else {
        setError(data.error || 'Failed to fetch images');
      }
    } catch (err) {
      setError('Network error while fetching images');
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.open('POST', '/api/upload');
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          fetchImages(); // Refresh the image list
        } else {
          setError(xhr.responseText || 'Upload failed');
        }
        setIsUploading(false);
      };
      xhr.send(formData);
    } catch (err) {
      setError('Upload failed');
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="space-y-2">
              <p className="font-medium">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">Supports: JPEG, PNG, GIF, WEBP</p>
            </>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Image Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6">Your Images</h2>
        
        {images.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No images found. Upload your first image!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {images.map((image) => (
                  <tr key={image.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      {image.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(image.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(image.lastModified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={image.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </a>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={async () => {
                          // Add delete functionality if needed
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}