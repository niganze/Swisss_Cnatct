// models/School.js
import { Schema, model } from 'mongoose';

const schoolSchema = new Schema({
    school_name: { type: String, required: true },
    district: { type: String, required: true },
    sector: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true }
});

const School = model('School', schoolSchema);

export default School;
