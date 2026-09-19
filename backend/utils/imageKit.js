import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';

dotenv.config();

const imageKit = new ImageKit({
    privateKey: `${process.env.IMAGE_KIT_PRIVATE_KEY}`,
    timeout: 30000
});

// function to upload image to ImageKit
const uploadImage = async (localFilePath) => {

    if (!localFilePath) {
        return null;
    }

    try {
        
        console.log("Uploading image to ImageKit:", localFilePath);
        const response = await imageKit.files.upload({
            file: fs.createReadStream(localFilePath),
            fileName: path.basename(localFilePath),
            folder: "/portfolio-images/"
        });
        console.log("ImageKit upload completed:", response.fileId);

        if (response) {
            // delete local file after upload
            fs.unlink(localFilePath, (err) => {
                if (err) {
                    console.error("Error deleting local file:", err);
                } else {
                    console.log("Local file deleted successfully");
                }
            });
        }
        
        return response;

    } catch (error) {
        console.error("Error uploading image to ImageKit:", error);
        return null;
    }
}

const deleteImage = async (fileId) => {

    if (!fileId) {
        return null;
    }

    try {
        
        const response = await imageKit.files.delete(fileId);
        return response;

    } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        return null;
    }
};

export { uploadImage, deleteImage };