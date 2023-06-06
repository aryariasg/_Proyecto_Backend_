import mongoose from 'mongoose';

// la estrictura se va a llamar schema

const productsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	thumbnail: {
		type: Array,
		required: true,
	},
	code: {
		type: Number,
		required: true,
		unique: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
});

export const productsModel = mongoose.model('Products', productsSchema); // metodo para crear una coleccion/modelo
