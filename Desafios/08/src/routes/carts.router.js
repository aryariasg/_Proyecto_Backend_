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

// Crear carrito
router.post('/', async (req, res) => {
	try {
		const cart = await cartManager.createCart();
		res.status(201).send({
			status: 'success',
			message: `Cart created. Cart ID: ${cart._id}`,
			payload: cart,
		});
	} catch (error) {
		//console.log(error);
		res.status(500).send({
			status: 'error',
			error: `Error creating cart with ID ${cart._id}`,
		});
	}
});

// buscar todos los carritos
router.get('/', async (req, res) => {
	try {
		const carts = await cartManager.getCarts();
		if (carts) {
			res.status(200).send({ status: 'success', payload: carts });
		} else {
			res.status(404).send({ status: 'error', error: 'Carts not found' });
		}
	} catch (error) {
		//console.log(error);
		res.status(500).send({ status: 'error', error: 'Error obtaining carts' });
	}
});

// buscar carrito por Id (cid)
router.get('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await cartManager.getCart(cid);
		if (cart) {
			res.status(200).send({
				status: 'success',
				message: `Cart with ID ${cid} found`,
				payload: cart,
			});
		} else {
			res
				.status(404)
				.send({ status: 'error', error: `Cart with ID ${cid} not found` });
		}
	} catch (error) {
		//console.log(error);
		res
			.status(500)
			.send({ status: 'error', error: `Error obtaining cart with ID ${cid}` });
	}
});

// agregar un producto al array del carrito
router.post('/:cid/products/:pid', async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const addProduct = await cartManager.addProductToCart(cid, pid);
		if (addProduct) {
			res.status(201).send({
				status: 'success',
				message: `Product ${pid} added to Cart ${cid}`,
				payload: addProduct,
			});
		} else {
			res.status(404).send({
				status: 'error',
				error: `Product ${pid} or Cart ${cid} not found`,
			});
		}
	} catch (error) {
		//console.log(error);
		res.status(500).send({
			status: 'error',
			error: `Error adding product ${pid} to Cart ${cid}`,
		});
	}
});

// router.post('/:cid/product/:pid', async (req, res) => {
// 	const { cid, pid } = req.params;
// 	const cart = await cartManager.addToCart(cid, pid);
// 	!cart ? res.status(404).json(notFound) : res.status(200).json(cart);
// });

// Eliminar un producto (pid) de un carrito (cid)
router.delete('/:cid/products/:pid', async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const deleteProductInCart = await cartManager.deleteProductFromCart(
			cid,
			pid
		);
		if (deleteProductInCart) {
			res.status(200).send({
				status: 'success',
				message: `Product ${pid} deleted from Cart ${cid}`,
				payload: deleteProductInCart,
			});
		} else {
			res.status(404).send({
				status: 'error',
				error: `Product ${pid} or Cart ${cid} not found`,
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			status: 'error',
			error: `Error deleting product ${pid} from Cart ${cid}`,
		});
	}
});

// Eliminar todos los productos de un carrito (cid)
router.delete('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await cartManager.deleteAllProductsFromCart(cid);
		if (cart) {
			res.status(200).send({
				status: 'success',
				message: `All products deleted from Cart ${cid}`,
				payload: cart,
			});
		} else {
			res.status(404).send({ status: 'error', error: `Cart ${cid} not found` });
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			status: 'error',
			error: `Error deleting prodcut from Cart ${cid}`,
		});
	}
});

// Actualizar todos los productos de un carrito (cid)
router.put('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;

		const cart = await cartManager.updateAllProductsFromCart(cid, products);

		if (cart) {
			res.status(200).send({
				status: 'success',
				message: `Products updated in Cart ${cid}`,
				payload: cart,
			});
		} else {
			res
				.status(404)
				.send({ status: 'error', error: `Cart ${cid} or products not found` });
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			status: 'error',
			error: `Error updating product in Cart ${cid}`,
		});
	}
});

// Actualizar solamente la cantidad de un producto (pid) de un carrito (cid)
router.put('/:cid/products/:pid', async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;

		const cart = await cartManager.updateProductQuantityFromCart(
			cid,
			pid,
			quantity
		);

		if (cart) {
			res.status(200).send({
				status: 'success',
				message: `Updated quantity of Product ${pid} in Cart ${cid}`,
				payload: cart,
			});
		} else {
			res.status(404).send({
				status: 'error',
				error: `Product ${pid} or Cart ${cid} not found`,
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			status: 'error',
			error: `Error updating quantity of Product ${pid} on Cart ${cid}`,
		});
	}
});

export default router;
