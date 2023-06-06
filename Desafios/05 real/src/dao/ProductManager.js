import fs, { existsSync } from "fs";

export default class ProductManager {
	constructor(path) {
		this.path = path;
	}

	async getProducts() {
		if (fs.existsSync(this.path)) {
			const products = await fs.promises.readFile(this.path, "utf-8");
			return JSON.parse(products);
		} else {
			console.log("file doesn't exist");
			return [];
		}
	}

	async getProductById(idProd) {
		const productsFile = await this.getProducts();
		const product = productsFile.find((p) => p.id === idProd);
		if (product) {
			return product;
		} else {
			return "Product not found";
		}
	}

	async addProduct(product) {
		const productsFile = await this.getProducts();

		const id = this.#idGenerator(productsFile);
		const newProduct = {
			id,
			title: product.title,
			description: product.description,
			price: product.price,
			thumbnail: product.thumbnail || [],
			code: product.code,
			stock: product.stock,
			status: true,
			category: product.category,
		};

		if (productsFile.some((pCode) => pCode.code === product.code)) {
			return "Code already exist";
		} else if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.status || !product.category) {
			return "Incompleted fields";
		} else {
			productsFile.push(newProduct);
			await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
			return newProduct;
		}
	}

	async updateProduct(idProd, obj) {
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
	}

	async deleteProducts() {
		if (existsSync(this.path)) {
			await fs.promises.unlink(this.path);
			return "Products deleted";
		} else {
			return "No products found";
		}
	}

	async deleteProductById(idProd) {
		const productsFile = await this.getProducts();
		const productIndex = productsFile.findIndex((p) => p.id === idProd);
		if (productIndex === -1) {
			return "Product doesn't exist";
		} else {
			productsFile.splice(productIndex, 1);
			await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
			return "Product deleted";
		}
	}

	#idGenerator = (products) => {
		let id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
		return id;
	};
}
