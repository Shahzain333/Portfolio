import { model, Schema } from 'mongoose';

const skillSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'language', 'other'],
    },
    proficiency: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
    },
    iconUrl: {
        type: String,
        trim: true,
        default: ''
    },
}, { timestamps: true });

const Skill = model('Skill', skillSchema);
export default Skill;