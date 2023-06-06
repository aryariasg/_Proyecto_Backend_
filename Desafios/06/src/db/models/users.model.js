import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
});

export const userModel = mongoose.model('Users', usersSchema);
