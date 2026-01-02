import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import express from "express";
import multer from "multer";


// ldLd55cagckGdOIdr2EXCMYSClE
// 784442438653756
// dmzen4ixs
// Cloudinary config (REQUIRED)
cloudinary.v2.config({
  cloud_name: 'dmzen4ixs',
  api_key: '784442438653756',
  api_secret: 'ldLd55cagckGdOIdr2EXCMYSClE',
});

// Storage config
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: "UserMessageImage",
//     format: async () => "png",
//     public_id: (req, file) => {
//       return file.originalname.split(".")[0];
//     },
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => ({
    folder: "UserMessageImage",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

// Multer middleware
const parser = multer({ storage });

export default parser;
