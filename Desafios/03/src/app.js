import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const productManager = new ProductManager("../products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
	const limit = req.query.limit;
	const products = await productManager.getProducts();
	if (limit) {
		const limitedProducts = products.slice(0, limit);
		res.json(limitedProducts);
	} else {
		res.json({ products });
	}
});

app.get("/products/:idProd", async (req, res) => {
	const { idProd } = req.params;
	const product = await productManager.getProductById(+idProd);
	res.json({ product });
});

app.post("/products", async (req, res) => {
	const obj = req.body;
	console.log("Info", obj);
	const newProduct = await productManager.addProduct(obj);
	res.json({ message: "Product created", product: newProduct });
});

app.put("/products/:idProd", async (req, res) => {
	const { idProd } = req.params;
	const obj = req.body;
	const product = await productManager.updateProduct(+idProd, obj);
	res.json({ product });
});

app.delete("/products", async (req, res) => {
	const message = await productManager.deleteProducts();
	res.json({ message });
});

app.delete("/products/:idProd", async (req, res) => {
	const { idProd } = req.params;
	const message = await productManager.deleteProductById(+idProd);
	res.json({ message });
});

app.listen(8080, () => {
	console.log("Escuchando al puerto 8080");
});
