import { Router } from 'express';
import ProductManager from '../dao/ProductManagerMongo.js';
import CartManager from '../dao/CartManagerMongo.js';
import { __dirname } from '../utils.js';

const router = Router();
// const productManager = new ProductManager(__dirname + '/Products.json');
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para visualizar todos los productos listados
router.get('/', async (req, res) => {
	const products = await productManager.getProducts();
	res.render('home', { products });
});

// Ruta para visualizar todos los productos en grilla
router.get('/realtimeproducts', async (req, res) => {
	const products = await productManager.getProducts();
	res.render('realTimeProducts', { products });
});

// Ruta para visualizar todos los productos con paginación
router.get('/products/page/:page', async (req, res) => {
	const page = req.params.page || 1;

	const products = await productManager.getProducts(2, page);
	// console.log(products);

	res.render('products', { products });
});

// Ruta para visualizar un producto en particular
router.get('/products/:id', async (req, res) => {
	const product = await productManager.getProductById(req.params.id);

	// console.log(product);

	const { _id, title, description, price, code, stock, category, thumbnail } =
		product;

	res.render('product', {
		id: _id,
		title,
		description,
		price,
		code,
		stock,
		category,
		thumbnail,
	});
});

// Ruta para visualizar el carrito de compras
router.get('/carts/:cid', async (req, res) => {
	const { cid } = req.params;
	const cart = await cartManager.getCart(cid);
	res.render('cart', { cart });
	console.log(cart.products);
	// res.json({ cart });
	// const { products } = cart;
});

export default router;
