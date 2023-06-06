import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
const productManager = new ProductManager(__dirname + "/Products.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// PORT
const PORT = 8080;
// HTTP Server
const httpServer = app.listen(PORT, () => {
	console.log(`escuchando al puerto ${PORT}`);
});

// HANDLEBARS
app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// ROUTES
app.use("/views", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// SOCKET Server

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
	console.log(`Client connected: ${socket.id}`);

	socket.on(`disconnect`, () => {
		console.log(`Client disconnected: ${socket.id}`); // log para cuando se cae la comunicación
	});

	socket.on("newProduct", (newProduct) => {
		console.log(`Product added: ${newProduct}`);
		productManager.addProduct({ ...newProduct });
	});

	socket.on("deleteProduct", (productId) => {
		console.log(`Product deleted ${productId}`);
		productManager.deleteProductById(productId);
	});

});
