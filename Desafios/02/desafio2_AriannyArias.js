const fs = require("fs");
const path = "./products.json";

class ProductManager {
	constructor(path) {
		this.path = path;
	}

	getProducts = async () => {
		if (fs.existsSync(path)) {
			const fileInfo = await fs.promises.readFile(this.path, "utf-8");
			const products = JSON.parse(fileInfo);
			return products;
		} else {
			console.log("file doesn't exist");
			return [];
		}
	};

	getProductById = async (id) => {
		const products = await this.getProducts();
		const product = products.find((p) => p.id === id);
		if (product) {
			return product;
		} else {
			return "product doesn't exist";
		}
	};

	addProduct = async (product) => {
		const products = await this.getProducts();
		const id = this.#idGenerator(products);
		const newProduct = { id, ...product };
		products.push(newProduct);
		await fs.promises.writeFile(this.path, JSON.stringify(products));
		return newProduct;
	};

	updateProduct = async (id, obj) => {
		const productsFile = await this.getProducts();
		const product = productsFile.find((p) => p.id === idProd);
		if (!product) {
			return "Product not found";
		} else {
			const updatedProduct = { ...product, ...obj };
			const productIndex = productsFile.findIndex((p) => p.id === idProd);
			productsFile.splice(productIndex, 1, updatedProduct);
			await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
			return "Product updated";
		}
	};

	deleteProducts = async () => {
		if (fs.existsSync(this.path)) {
			await fs.promises.unlink(this.path);
			return "products deleted";
		} else {
			return "products doesn't found";
		}
	};

	deleteProduct = async (id) => {
		const products = await this.getProducts();
		const newProductsArray = products.filter((p) => p.id !== id);
		await fs.promises.writeFile(this.path, JSON.stringify(newProductsArray));
		console.log("product deleted");
	};

	// Métodos privados al final

	#idGenerator = (products) => {
		let id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
		return id;
	};
}

const product1 = {
	title: "Jamon",
	description: "Mediterraneo",
	price: 500,
	thumbnail: "thumbnail",
	code: 1,
	stock: 10,
};
const product2 = {
	title: "Queso",
	description: "Suizo",
	price: 600,
	thumbnail: "thumbnail",
	code: 2,
	stock: 15,
};
const product3 = {
	title: "Pan",
	description: "Arabe",
	price: 750,
	thumbnail: "thumbnail",
	code: 3,
	stock: 20,
};
const product4 = {
	title: "Mayonesa",
	description: "Orgánica",
	price: 430,
	thumbnail: "thumbnail",
	code: 4,
	stock: 25,
};
const product5 = {
	title: "Huevo",
	description: "De granja",
	price: 150,
	thumbnail: "thumbnail",
	code: 5,
	stock: 50,
};

async function add() {
	const manager = new ProductManager(path);
	await manager.addProduct(product1);
	await manager.addProduct(product2);
	await manager.addProduct(product3);
	await manager.addProduct(product4);
	await manager.addProduct(product5);
	const products = await manager.getProducts();
	console.log(products);
}

async function getById() {
	const manager = new ProductManager(path);
	console.log(await manager.getProductById(3)); // producto existe
	console.log(await manager.getProductById(11)); // producto no existe
}

async function deleteById() {
	const manager = new ProductManager(path);
	await manager.deleteProduct(3);
}

async function deleteAll() {
	const manager = new ProductManager(path);
	await manager.deleteProducts();
}

async function update() {
	const manager = new ProductManager(path);
	await manager.updateProduct(3, { price: 550 });
	await manager.updateProduct(2, { stock: 10 });
}

// add()
// getById()
// deleteById()
// deleteAll()
// update()
