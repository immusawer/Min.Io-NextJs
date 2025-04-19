# Min.Io-NextJs
Implement MinIo S3 using Nextjs
MinIO Image Manager with Next.js
Project Screenshot <!-- Add a screenshot if available -->

A modern web application for uploading, managing, and viewing images stored in MinIO object storage. Built with Next.js, TypeScript, and Tailwind CSS.

Features
🖼️ Drag-and-drop image upload interface

📊 Tabular display of all images with preview thumbnails

⚡ Real-time upload progress indicators

🔍 View full-size images with direct links

📅 Sortable by upload date and file size

🔒 Secure server-side image handling

Prerequisites
Before you begin, ensure you have:

Node.js (v18 or later)

npm or yarn

Running MinIO server (local or remote)

Git (for version control)

Installation
Clone the repository:

bash
git clone https://github.com/your-username/minio-image-manager.git
cd minio-image-manager
Install dependencies:

bash
npm install
# or
yarn install
Set up environment variables:

bash
cp .env.example .env.local
Edit the .env.local file with your MinIO credentials:

env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=your-bucket-name
Running the Application
Start the development server:

bash
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser.

Building for Production
To create an optimized production build:

bash
npm run build
# or
yarn build
Start the production server:

bash
npm start
# or
yarn start
Project Structure
minio-image-manager/
├── app/
│   ├── api/
│   │   ├── upload/      # Image upload API endpoint
│   │   └── images/      # Image listing API endpoint
│   ├── layout.tsx       # Main application layout
│   └── page.tsx         # Main page component
├── lib/
│   └── minio-client.ts  # MinIO client configuration
├── public/              # Static files
├── types/               # TypeScript type definitions
├── .env.example         # Environment variables template
├── next.config.js       # Next.js configuration
└── package.json         # Project dependencies
Technologies Used
Next.js - React framework

TypeScript - Type checking

Tailwind CSS - Styling

React Dropzone - File upload handling

MinIO JavaScript SDK - Object storage client

Contributing
Contributions are welcome! Please follow these steps:

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.

Contact
Adbul Musawer Dinzad - Dinzad.musawer@gmail.com

Project Link: https://github.com/immusawer/Min.Io-NextJs

Acknowledgments
MinIO for the excellent object storage solution

Next.js team for the amazing framework

React Dropzone maintainers
