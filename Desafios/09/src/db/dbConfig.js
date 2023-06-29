import mongoose from 'mongoose';

const URI =
	'mongodb+srv://elSonoSapiens:2xyjhtHqPvGEOdZG@cluster0.eu8lqfi.mongodb.net/ecommerce?retryWrites=true&w=majority'; // se debe reemplazar la contraseña y luego del / colocar el nombre de la base de datos ?

mongoose
	.connect(URI)
	.then(() => console.log('conected to database'))
	.catch((error) => console.log(error));
