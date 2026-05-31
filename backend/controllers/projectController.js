import projectModel from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiErrorResponse from '../utils/apiErrorResponse.js';
import APIResponse from '../utils/apiResponse.js';
import { uploadImage, deleteImage } from '../utils/imageKit.js';

const addProject = asyncHandler( async (req, res) => {
    
    const { title, description, category, projectUrl, sourceCodeUrl, status } = req.body;

    const valFields = [title, description, projectUrl, sourceCodeUrl, status];
    
    // validate category
    const validCategories = ['frontend', 'backend', 'fullstack', 'mernstack', 'gen-ai', 'agent', 'other'];
    
    if (category) {
        for (const key in validCategories) {
            if (category[key] !== category[key]) {
                return res.status(400).json(new ApiErrorResponse(400, "Invalid category value"));
           }
        }
    }else {
        return res.status(400).json(new ApiErrorResponse(400, "Category is required"));
    }

    // Validate required fields
    valFields.forEach( (field) => {
        if (field?.trim() === '' || field == null || field == undefined) {
           return res.status(400).json(new ApiErrorResponse(400, "All fields are required"+ field));
        }
    })

    try {
        
        // validate if project with same title already exists
        const isProjectExists = await ProjectModel.findOne({ title: title.trim() });

        if (isProjectExists) {
            return res.status(409).json(new ApiErrorResponse(409, "Project with same title already exists"));
        }

        // Add project data to database
        const project = await ProjectModel.create(
            { title, description, category, projectUrl, sourceCodeUrl, status }
        );

        // upload image to ImageKit
        const ImagePath = req.file?.path;
       
        if (ImagePath) {
       
            const imageUploadResponse =  await uploadImage(ImagePath);
            console.log("Image upload response:", imageUploadResponse);

            if (imageUploadResponse) {
                
                project.imageUrl = imageUploadResponse.url;
                project.imageId = imageUploadResponse.fileId;
                await project.save();

            }else {
                return res.status(500).json(new ApiErrorResponse(500, "Image upload failed"));
            }

        }
        
        // Return success response
        return res.status(201).json(new APIResponse(201, project, "Project added successfully"));

    } catch (error) {
        console.error("Error adding project:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Somthing went wrong while adding project"));
    }

});

export { addProject };