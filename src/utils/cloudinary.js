import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (filePath) => {
        try {
            if(!filePath) {
                throw new Error('File path is required for upload');
            }
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: 'auto' // Automatically detect the resource type (image, video, etc.)
            })
            console.log("File is sucessfully uploaded", result.secure_url);
            fs.unlinkSync(filePath); // Remove the file from local storage after upload
            return result; // Return the secure URL of the uploaded file
        } catch (error) {
            fs.unlinkSync(filePath); // Remove the file from local storage after upload
            console.error('Error uploading to Cloudinary:', error);
            throw error; // Propagate the error for further handling
        }
    }

    export { uploadOnCloudinary };