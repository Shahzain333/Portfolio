import { model, Schema } from "mongoose";

const experienceSchema = new Schema({
        companyName: { type: String, required: true, unique: true, trim: true },
        role: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        description: { type: String, required: false, maxlength: 1000 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: false },  
        employmentType: { type: String, enum: ['full-time', 'part-time', 'internship', 'freelance', 'contract'],
          default: 'full-time' }  
},{ timestamps: true });

const Experience = model("Experience", experienceSchema);

export default Experience;