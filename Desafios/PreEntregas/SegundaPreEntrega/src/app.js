import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import chatRouter from './routes/chat.router.js';
// import ProductManager from "./ProductManager.js";
import './db/dbConfig.js';
import ProductManager from './dao/ProductManagerMongo.js';
import ChatManager from './dao/chatManagerMongo.js';

const app = express();
//const productManager = new ProductManager(__dirname + "/Products.json");

const productManager = new ProductManager();
const chatManager = new ChatManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// PORT
const PORT = 8080;
// HTTP Server
const httpServer = app.listen(PORT, () => {
	console.log(`escuchando al puerto ${PORT}`);
});

// HANDLEBARS
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// ROUTES
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);
app.use('/chat', chatRouter);

// WEBSOCKET
const infoMensajes = [];

// SOCKET Server

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
	console.log(`Client connected: ${socket.id}`);
	const products = await productManager.getProducts();
	const messages = await chatManager.getAllMessages();

	socket.on(`disconnect`, () => {
		console.log(`Client disconnected: ${socket.id}`); // log para cuando se cae la comunicación.
	});

	socket.emit('products', products);
	// console.log(products);

	//PRODUCTS

	// socket.on('newProduct', (newProduct) => {
	// 	console.log(`Product added: ${newProduct}`);
	// 	productManager.addProduct({ ...newProduct });
	// });

	socket.on('newProduct', async (newProduct) => {
		await productManager.addProduct(newProduct);
		socket.emit('products', products);
	});

	// socket.on('deleteProduct', async (productId) => {
	// 	await productManager.deleteProductById(productId);
	// 	console.log(`Product deleted ${productId}`);
	// });

	socket.on('deleteProduct', async (productId) => {
		await productManager.deleteProductById(productId);
		socket.emit('products', products);
		// console.log(productId);
	});

	//CHAT

	socket.on('message', async (info) => {
		infoMensajes.push(info);
		socketServer.emit('chat', infoMensajes);
		await chatManager.addMessage(info);
		socket.emit('messages', messages);
	});

	socket.on('usuarioNuevo', (usuario) => {
		socket.broadcast.emit('broadcast', usuario);
		socket.emit('chat', infoMensajes);
	});
});

/*Hola Diego. Te hablo al respecto de la entrega: La ruta get api/products, funciona correcttamente. Encontré un error a la hora de modificar el producto, no me deja modificarlo porque se repite code, cosa que no debería preguntar ya que si debería tener el mismo code. Estaría bueno que se agregue un mensaje acorde en las rutas si no funciona o no se realiza lo que se desea en cada ruta.

Estaría bueno que en la ruta post de api/carts, puedas responder con el id del carrito y un mensaje acorde de que creaste ese carrito. En la ruta put, que te deja modificar la cantidad de un producto, está buscando mal el parámetro que le estas pasando, tendrías que replantearlo en el manager. Revísalo y cualquier cosa me decís.*/
