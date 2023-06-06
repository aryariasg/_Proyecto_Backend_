import { Router } from "express";
import ProductManager from "../ProductManager.js";
import __dirname from "../utils.js";

const productManager = new ProductManager(__dirname + "/Products.json");

const router = Router();

router.get("/", async (req, res) => {
	const limit = req.query.limit;
	const products = await productManager.getProducts();
	if (limit) {
		const limitedProducts = products.slice(0, limit);
		res.json(limitedProducts);
	} else {
		res.json({ products });
	}
});

router.get("/:pid", async (req, res) => {
	const { pid } = req.params;
	const product = await productManager.getProductById(+pid);
	res.json({ product });
});

router.post("/", async (req, res) => {
	const obj = req.body;
	const newProduct = await productManager.addProduct(obj);
	res.json({ newProduct });
});

router.put("/:pid", async (req, res) => {
	const { pid } = req.params;
	const obj = req.body;
	const product = await productManager.updateProduct(+pid, obj);
	res.json({ product });
});

router.delete("/", async (req, res) => {
	const message = await productManager.deleteProducts();
	res.json({ message });
});

router.delete("/:pid", async (req, res) => {
	const { pid } = req.params;
	const message = await productManager.deleteProductById(+pid);
	res.json({ message });
});

export default router;
