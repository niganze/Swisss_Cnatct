// models/User.js
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    names: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'school'], required: true }
});

const User = model('User', userSchema);
export default User;

