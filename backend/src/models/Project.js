// models/Project.js
import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
    project_name: { type: String, required: true },
    project_owner: { type: String, required: true },
    project_file: { type: String, required: true },
    school: { type: Schema.Types.ObjectId, ref: 'School' },
    status: { type: String, enum: ['Pending', 'Selected', 'Rejected'], default: 'Pending' }
});

const Project = model('Project', projectSchema);

export default Project;
