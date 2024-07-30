import { Schema, model } from 'mongoose';
import { genSalt, hash } from 'bcryptjs';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

 export const User = model('User', UserSchema);


