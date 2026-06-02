import Experience from "../models/Experience.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import APIResponse from "../utils/apiResponse.js";

const addExperience = asyncHandler(async (req, res) => {

    const { companyName, role, position, description, startDate, endDate, employmentType, isCurrent } = req.body;

    const requiredFields = { companyName, role, position, startDate, employmentType };

    for (const [key, value] of Object.entries(requiredFields)) {

        if (!value || value?.trim() === "" || value === null || value === undefined) {
            return res.status(400).json(new ApiErrorResponse(400, `${key} is required and cannot be empty.`));
        }

    }

    // Validate description length
    if (description && description?.length > 3000) {
        return res.status(400).json(new ApiErrorResponse(400, "Description is too long. Maximum 3000 characters allowed."));
    }

    // date comparison should only run when isCurrent is false and endDate is provided
    if(!isCurrent && endDate) {
    
        const start = new Date(startDate);
        const end   = new Date(endDate);
 
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json(new ApiErrorResponse(400, "Invalid date format."));
        }
 
        if (start >= end) {
            return res.status(400).json(new ApiErrorResponse(400, "End date must be greater than start date."));
        }

    }

    // if isCurrent is true, endDate should not be provided
    if (isCurrent && endDate) {
        return res.status(400).json(new ApiErrorResponse(400, "End date should not be provided if currently working."));
    }
 
    // if isCurrent is false, endDate is required
    if (!isCurrent && !endDate) {
        return res.status(400).json(new ApiErrorResponse(400, "End date is required if not currently working."));
    }

    // Check for duplicate experience
    const existingExperience = await Experience.findOne({ companyName: companyName.trim() });

    if (existingExperience) {
        return res.status(409).json(new ApiErrorResponse(409, `${companyName} experience already exists.`));
    }
    
    // add to the database
    try {
        const dbResponse = await Experience.create({
            companyName,
            role,
            position,
            description,
            startDate,
            endDate:    isCurrent ? null : endDate,
            isCurrent:  isCurrent || false,
            employmentType: employmentType || 'full-time'
        });
 
        return res.status(201).json(new APIResponse(201, dbResponse, "Experience added successfully."));
 
    } catch (error) {
        console.error("Error adding experience in backend:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while adding experience."));
    }
});

const updateExperience = asyncHandler(async (req, res) => {

    const experienceId = req.params.id;
    const { companyName, role, position, description, startDate, endDate, employmentType, isCurrent } = req.body;

    // validate experience existence
    const experience = await Experience.findById(experienceId);
 
    if (!experience) {
        return res.status(404).json(new ApiErrorResponse(404, "Experience not found."));
    }

    // validate description length
    if (description && description.length > 1000) {
        return res.status(400).json(new ApiErrorResponse(400, "Description is too long. Maximum 1000 characters allowed."));
    }
 
    // date validation only when both are present
    if (startDate && endDate && !isCurrent) {
     
        const start = new Date(startDate);
        const end   = new Date(endDate);
 
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json(new ApiErrorResponse(400, "Invalid date format."));
        }
 
        if (start >= end) {
            return res.status(400).json(new ApiErrorResponse(400, "End date must be greater than start date."));
        }
    }

    // if switching to isCurrent true, endDate must be cleared
    if (isCurrent === true && endDate) {
        return res.status(400).json(new ApiErrorResponse(400, "End date should not be provided if currently working."));
    }
 
    // if switching to isCurrent false, endDate is required
    if (isCurrent === false && !endDate && !experience.endDate) {
        return res.status(400).json(new ApiErrorResponse(400, "End date is required if not currently working."));
    }

    // update fields — only update what is provided
    experience.companyName = companyName || experience.companyName;
    experience.role = role || experience.role;
    experience.position = position || experience.position;
    experience.description = description || experience.description;
    experience.startDate = startDate || experience.startDate;
    experience.isCurrent = isCurrent ?? experience.isCurrent;
    experience.endDate = (isCurrent === true) ? null : (endDate || experience.endDate);
    experience.employmentType = employmentType  || experience.employmentType;

    try {
        
        const updatedExperience = await experience.save();
        return res.status(200).json(new APIResponse(200, updatedExperience, "Experience updated successfully."));

    } catch (error) {
        console.error("Error updating experience in backend:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while updating experience."));
    }


});

const deleteExperience = asyncHandler(async (req, res) => {
    
    const experienceId = req.params.id;

    const experience = await Experience.findById(experienceId);
 
    if (!experience) {
        return res.status(404).json(new ApiErrorResponse(404, "Experience not found."));
    }
 
    try {
        
        await Experience.findByIdAndDelete(experienceId);
        return res.status(200).json(new APIResponse(200, {}, "Experience deleted successfully."));

    } catch (error) {
        console.error("Error deleting experience in backend:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while deleting experience."));
    }

});

const getAllExperience = asyncHandler(async (req, res) => {
    try {
        
        const experiences = await Experience.find().sort({ startDate: -1 }); // sort by startDate descending
        res.status(200).json(new APIResponse(200, experiences, "Experiences retrieved successfully."))

    } catch (error) {
        console.error("Error fetching experience in backend:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while fetching experience."));
    }

});

export { addExperience, updateExperience, deleteExperience, getAllExperience };