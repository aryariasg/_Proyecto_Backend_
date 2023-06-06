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
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoStore from 'connect-mongo';
import usersRouter from './routes/users.router.js';
// passport
import '../passport/passportStrategies.js';
import passport from 'passport';

const app = express();
//const productManager = new ProductManager(__dirname + "/Products.json");

const productManager = new ProductManager();
const chatManager = new ChatManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// PORT
const PORT = 8080;
// HTTP Server
const httpServer = app.listen(PORT, () => {
	//console.log(`escuchando al puerto ${PORT}`);
});

// Mongo session
app.use(
	session({
		// dónde se guardará la session
		store: new mongoStore({
			// config para conectarse a la DB
			mongoUrl:
				'mongodb+srv://elSonoSapiens:2xyjhtHqPvGEOdZG@cluster0.eu8lqfi.mongodb.net/ecommerce?retryWrites=true&w=majority',
		}),
		secret: 'SessionKey',
		cookie: {
			maxAge: 6000, // tiempo de vida de la credencial del usuario. Una vez pasado el tiempo, se pierde la credencial del usuario y deberá volver a indentificarse
		},
	})
);

// HANDLEBARS
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// config passport

app.use(passport.initialize()); // para inicializar passport
app.use(passport.session()); // para que trabaje con sesiones

// ROUTES
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);
app.use('/chat', chatRouter);
app.use('/users', usersRouter);

// WEBSOCKET
const infoMensajes = [];

// SOCKET Server

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
	//console.log(`Client connected: ${socket.id}`);
	const products = await productManager.getProducts();
	const messages = await chatManager.getAllMessages();

	socket.on(`disconnect`, () => {
		//console.log(`Client disconnected: ${socket.id}`); // log para cuando se cae la comunicación.
	});

	socket.emit('products', products);
	// //console.log(products);

	//PRODUCTS

	// socket.on('newProduct', (newProduct) => {
	// 	//console.log(`Product added: ${newProduct}`);
	// 	productManager.addProduct({ ...newProduct });
	// });

	socket.on('newProduct', async (newProduct) => {
		await productManager.addProduct(newProduct);
		socket.emit('products', products);
	});

	// socket.on('deleteProduct', async (productId) => {
	// 	await productManager.deleteProductById(productId);
	// 	//console.log(`Product deleted ${productId}`);
	// });

	socket.on('deleteProduct', async (productId) => {
		await productManager.deleteProductById(productId);
		socket.emit('products', products);
		// //console.log(productId);
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

// Cookies
app.use(cookieParser());
