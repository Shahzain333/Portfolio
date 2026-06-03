import Skill from "../models/Skill.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import APIResponse from "../utils/apiResponse.js";

const addSkill = asyncHandler(async (req, res) => {

    const { name, category, proficiency, iconUrl } = req.body;

    // validate required fields
    const requiredFields = { name, category, proficiency };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === "") {
            return res.status(400).json(new ApiErrorResponse(400, `${key} is required`));
        }
    }

    // validate category enum
    const allowedCategories = ['frontend', 'backend', 'database', 'devops', 'tools', 'language', 'other'];
    if (!allowedCategories.includes(category)) {
        return res.status(400).json(new ApiErrorResponse(400, `Invalid category. Allowed: ${allowedCategories.join(', ')}`));
    }

    // validate proficiency enum
    const allowedProficiency = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!allowedProficiency.includes(proficiency)) {
        return res.status(400).json(new ApiErrorResponse(400, `Invalid proficiency. Allowed: ${allowedProficiency.join(', ')}`));
    }

    // check for duplicate skill
    const existingSkill = await Skill.findOne({ name: name.trim() });
    if (existingSkill) {
        return res.status(409).json(new ApiErrorResponse(409, `${name} skill already exists.`));
    }

    try {

        const dbResponse = await Skill.create({
            name,
            category,
            proficiency,
            iconUrl: iconUrl || ''
        });

        return res.status(201).json(new APIResponse(201, dbResponse, "Skill added successfully."));

    } catch (error) {
        console.error("Error adding skill:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while adding skill."));
    }

});

const updateSkill = asyncHandler(async (req, res) => {

    const skillId = req.params.id;
    const { name, category, proficiency, iconUrl } = req.body;

    // validate skill existence
    const skill = await Skill.findById(skillId);
    if (!skill) {
        return res.status(404).json(new ApiErrorResponse(404, "Skill not found."));
    }

    // validate category if provided
    if (category) {
        const allowedCategories = ['frontend', 'backend', 'database', 'devops', 'tools', 'language', 'other'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json(new ApiErrorResponse(400, `Invalid category. Allowed: ${allowedCategories.join(', ')}`));
        }
    }

    // validate proficiency if provided
    if (proficiency) {
        const allowedProficiency = ['beginner', 'intermediate', 'advanced', 'expert'];
        if (!allowedProficiency.includes(proficiency)) {
            return res.status(400).json(new ApiErrorResponse(400, `Invalid proficiency. Allowed: ${allowedProficiency.join(', ')}`));
        }
    }

    // check duplicate name if name is being changed
    if (name && name.trim() !== skill.name) {
        const existingSkill = await Skill.findOne({ name: name.trim() });
        if (existingSkill) {
            return res.status(409).json(new ApiErrorResponse(409, `${name} skill already exists.`));
        }
    }

    // update fields — only update what is provided
    skill.name        = name        || skill.name;
    skill.category    = category    || skill.category;
    skill.proficiency = proficiency || skill.proficiency;
    skill.iconUrl     = iconUrl     || skill.iconUrl;

    try {

        await skill.save();

        return res.status(200).json(new APIResponse(200, skill, "Skill updated successfully."));

    } catch (error) {
        console.error("Error updating skill:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while updating skill."));
    }

});

const deleteSkill = asyncHandler(async (req, res) => {

    const skillId = req.params.id;

    // validate skill existence
    const skill = await Skill.findById(skillId);
    if (!skill) {
        return res.status(404).json(new ApiErrorResponse(404, "Skill not found."));
    }

    try {

        await Skill.findByIdAndDelete(skillId);

        return res.status(200).json(new APIResponse(200, null, "Skill deleted successfully."));

    } catch (error) {
        console.error("Error deleting skill:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while deleting skill."));
    }

});

const getAllSkills = asyncHandler(async (req, res) => {

     try {
        
        const skills = await Skill.find().sort({ createdAt: -1 })
        res.status(200).json(new APIResponse(200, skills, "Skills retrieved successfully."))

    } catch (error) {
        console.error("Error fetching skills:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while fetching skills."));
    }

});

const getSkillsByCategory = asyncHandler(async (req, res) => {

    const { category } = req.params;

    const allowedCategories = ['frontend', 'backend', 'database', 'devops', 'tools', 'language', 'other'];
    if (!allowedCategories.includes(category)) {
        return res.status(400).json(new ApiErrorResponse(400, `Invalid category. Allowed: ${allowedCategories.join(', ')}`));
    }

    try {

        const skills = await Skill.find({ category }).sort({ name: 1 }).lean();

        if (!skills || skills.length === 0) {
            return res.status(404).json(new ApiErrorResponse(404, `No skills found under ${category} category.`));
        }

        return res.status(200).json(new APIResponse(200, skills, `${category} skills fetched successfully.`));

    } catch (error) {
        console.error("Error fetching skills by category:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while fetching skills."));
    }

});

export { addSkill, updateSkill, deleteSkill, getAllSkills, getSkillsByCategory };