const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for resources
const resourceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reality-academy/resources',
    resource_type: 'auto',
  },
});

// Storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reality-academy/avatars',
    resource_type: 'image',
  },
});

// Storage for certificates
const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reality-academy/certificates',
    resource_type: 'raw',
  },
});

// Multer instances
const uploadResource = multer({ storage: resourceStorage });
const uploadAvatar = multer({ storage: avatarStorage });
const uploadCertificate = multer({ storage: certificateStorage });

// Upload to Cloudinary helper
const uploadToCloudinary = async (file, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

// Delete from Cloudinary helper
const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadResource,
  uploadAvatar,
  uploadCertificate,
  uploadToCloudinary,
  deleteFromCloudinary,
};
