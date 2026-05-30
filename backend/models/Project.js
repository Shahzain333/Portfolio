import { schema, model } from 'mongoose';

const projectSchema = new schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: [String],
        required: false,
        trim: true,
    },
    sourceCodeUrl: {
        type: String,
        trim: true,
        default: ''
    },
    projectUrl: {
        type: String,
        trim: true,
        default: ''
    },
    imageId: {
        type: String,
        required: false,
        trim: true,
    },
    imageUrl: {    
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'archived'],
        default: 'completed'
    },
}, { timestamps: true });

const Project = model('Project', projectSchema);

export default Project;