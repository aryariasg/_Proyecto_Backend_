import mongoose from 'mongoose';

// La estrictura se va a llamar schema
const messagesSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

export const messagesModel = mongoose.model('Messages', messagesSchema); // metodo para crear una coleccion/modelo
