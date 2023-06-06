import { Router } from 'express';
//import CartManager from '../dao/CartManager.js';
import CartManager from '../dao/CartManagerMongo.js';
import { __dirname } from '../utils.js';

const carts = [];
const router = Router();

//const cartManager = new CartManager(__dirname + '/Carts.json');
const cartManager = new CartManager();

// crear carrito
// router.post('/', async (req, res) => {
// 	const newCart = await cartManager.createCart();
// 	res.json = { cart: newCart };
// });

router.post('/', async (req, res) => {
	await cartManager.createCart();
	res.status(201).json({ mensaje: 'Carrito creado con exito' });
});

// buscar carrito
router.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	const cart = await cartManager.getCart(cid);
	res.json({ cart });
});

// agregar un producto al array del carrito
router.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const addProduct = await cartManager.addProductToCart(cid, pid);
	res.json({ message: addProduct });
});

// router.post('/:cid/product/:pid', async (req, res) => {
// 	const { cid, pid } = req.params;
// 	const cart = await cartManager.addToCart(cid, pid);
// 	!cart ? res.status(404).json(notFound) : res.status(200).json(cart);
// });

export default router;
