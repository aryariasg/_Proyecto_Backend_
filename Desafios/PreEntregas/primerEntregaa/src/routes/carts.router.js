import { Router } from "express";
import { CartManager } from "../CartManager.js";
import __dirname from "../utils.js";

const carts = [];
const router = Router();

const cartManager = new CartManager(__dirname + "/Carts.json");

// crear carrito
router.post("/", async (req, res) => {
	const newCart = await cartManager.createCart();
	res.json = ({ cart: newCart });
});

// buscar carrito
router.get("/:cid", async (req, res) => {
	const { cid } = req.params;
	const cart = await cartManager.getCart(+cid);
	res.json({ cart });
});

// agregar un producto al array del carrito
router.post("/:cid/product/:pid", async (req, res) => {
	const { cid, pid } = req.params;
	const addProduct = await cartManager.addProductToCart(+cid, +pid);
	res.json({ message: addProduct });
});

export default router;
