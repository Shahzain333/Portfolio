import ProjectModel from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiErrorResponse from '../utils/apiErrorResponse.js';
import APIResponse from '../utils/apiResponse.js';
import { uploadImage, deleteImage } from '../utils/imageKit.js';

const addProject = asyncHandler(async (req, res) => {

    const { title, description, category, projectUrl, sourceCodeUrl, status } = req.body;

    const requiredFields = { title, description, projectUrl, sourceCodeUrl, status }

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === '') {
            return res.status(400).json(new ApiErrorResponse(400, `${key} is required`));
        }
    }

    const validCategories = ['frontend', 'backend', 'fullstack', 'mernstack', 'gen-ai', 'agent', 'other'];

    if (!category) {
        return res.status(400).json(new ApiErrorResponse(400, "Category is required"));
    }

    if (!validCategories.includes(category)) {
        return res.status(400).json(new ApiErrorResponse(400, `Invalid category. Allowed: ${validCategories.join(', ')}`));
    }

    // image is required when adding a new project
    const imagePath = req.file?.path;
    if (!imagePath) {
        return res.status(400).json(new ApiErrorResponse(400, "Project image is required"));
    }

    try {

        const isProjectExists = await ProjectModel.findOne({ title: title.trim() });

        if (isProjectExists) {
            return res.status(409).json(new ApiErrorResponse(409, "Project with same title already exists"));
        }

        // upload image BEFORE creating project, so we have imageUrl ready
        const imageUploadResponse = await uploadImage(imagePath);
        console.log("Image upload response:", imageUploadResponse);

        if (!imageUploadResponse) {
            return res.status(500).json(new ApiErrorResponse(500, "Image upload failed"));
        }

        // create project with image data from upload response
        const project = await ProjectModel.create({
            title,
            description,
            category,
            projectUrl,
            sourceCodeUrl,
            status,
            imageUrl: imageUploadResponse.url,
            imageId:  imageUploadResponse.fileId
        });

        return res.status(201).json(new APIResponse(201, project, "Project added successfully"));

    } catch (error) {
        console.error("Error adding project:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while adding project"));
    }

});

const updateProject = asyncHandler(async (req, res) => {

    const projectId = req.params.id;
    const { title, description, category, projectUrl, sourceCodeUrl, status } = req.body;

    // validate project existence
    const project = await ProjectModel.findById(projectId);

    if (!project) {
        return res.status(404).json(new ApiErrorResponse(404, "Project not found"));
    }

    // validate category if provided
    if (category) {

        const validCategories = ['frontend', 'backend', 'fullstack', 'mernstack', 'gen-ai', 'agent', 'other'];
        
        if (!validCategories.includes(category)) {
            return res.status(400).json(new ApiErrorResponse(400, `Invalid category. Allowed: ${validCategories.join(', ')}`));
        }

    }

    // update text fields
    project.title         = title         || project.title;
    project.description   = description   || project.description;
    project.category      = category      || project.category;
    project.projectUrl    = projectUrl    || project.projectUrl;
    project.sourceCodeUrl = sourceCodeUrl || project.sourceCodeUrl;
    project.status        = status        || project.status;

    // handle image update only if a new file is provided
    const imagePath = req.file?.path;

    if (imagePath) {
        try {

            // upload new image FIRST before deleting old one
            // old code deleted first — if upload failed, image was permanently lost
            const imageUploadResponse = await uploadImage(imagePath);
            console.log("Image upload response:", imageUploadResponse);

            if (!imageUploadResponse) {
                return res.status(500).json(new ApiErrorResponse(500, "Image upload failed"));
            }

            // only delete old image AFTER new upload succeeds
            if (project.imageId) {

                const deleteResponse = await deleteImage(project.imageId);
                
                console.log("Previous image deletion response:", deleteResponse);
                
                if (!deleteResponse) {
                    console.warn("Old image deletion failed for imageId:", project.imageId);
                    // non-fatal — new image is already uploaded, log and continue
                }

            }

            project.imageUrl = imageUploadResponse.url;
            project.imageId  = imageUploadResponse.fileId;

        } catch (error) {
            console.error("Error handling image update:", error);
            return res.status(500).json(new ApiErrorResponse(500, "Something went wrong during image update"));
        }
    }

    // always save — old code only called save() inside if(imagePath) block
    // text field updates were never saved when no new image was provided
    await project.save();

    return res.status(200).json(new APIResponse(200, project, "Project updated successfully"));

});

const deleteProject = asyncHandler(async (req, res) => {

    const projectId = req.params.id;

    // validate project existence
    const project = await ProjectModel.findById(projectId);

    if (!project) {
        return res.status(404).json(new ApiErrorResponse(404, "Project not found"));
    }

    try {

        const projectImageId = project.imageId;

        // delete from DB first
        await ProjectModel.findByIdAndDelete(projectId);

        // then delete image from ImageKit — non-fatal if it fails
        if (projectImageId) {
           
            const deleteResponse = await deleteImage(projectImageId);
           
            console.log("Project image deletion response:", deleteResponse);
           
            if (!deleteResponse) {
                console.warn("ImageKit deletion failed for imageId:", projectImageId);
                // project is already deleted from DB — just log and continue
            }

        }

        return res.status(200).json(new APIResponse(200, null, "Project deleted successfully"));

    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while deleting project"));
    }

});

const getAllProjects = asyncHandler(async (req, res) => {

    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;

    // validate before calculating skip
    if (page < 1 || limit < 1) {
        return res.status(400).json(new ApiErrorResponse(400, "Invalid pagination parameters"));
    }

    const skip = (page - 1) * limit;

    try {

        const [projects, totalProjects] = await Promise.all([
            ProjectModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
            ProjectModel.countDocuments()
        ]);

        const totalPages = Math.ceil(totalProjects / limit);

        return res.status(200).json(new APIResponse(200, {
            projects,
            pagination: {
                totalProjects,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        }, "Projects fetched successfully"));

    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while fetching projects"));
    }

});

const searchProject = asyncHandler(async (req, res) => {

    const { query } = req.params;
    console.log("Search query:", query);

    if (!query || query.trim() === '') {
        return res.status(400).json(new ApiErrorResponse(400, "Search query is required"));
    }

    try {

        // was using findOne — returns only 1 result
        // find() returns ALL matching projects
        const projects = await ProjectModel.find({
            title: {
                $regex: query.trim(),
                $options: 'i'
            }
        }).lean();

        if (!projects || projects.length === 0) {
            return res.status(404).json(new ApiErrorResponse(404, "No projects found matching your search"));
        }

        console.log("Found projects:", projects.length);

        return res.status(200).json(new APIResponse(200, projects, "Projects fetched successfully"));

    } catch (error) {
        console.error("Error searching projects:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while searching projects"));
    }

});

export { addProject, updateProject, deleteProject, getAllProjects, searchProject };