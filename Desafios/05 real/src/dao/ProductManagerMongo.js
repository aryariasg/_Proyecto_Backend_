import { productsModel } from '../db/models/products.model.js';

export default class ProductManager {
	async getProducts() {
		try {
			const products = await productsModel.find().lean();
			return products;
		} catch (error) {
			console.log(error);
		}
	}

	async getProductById(idProd) {
		try {
			const product = await productsModel.find({ _id: idProd });
			if (product) {
				return product;
			} else {
				throw new Error(`Producto con id ${id} no encontrado`);
			}
		} catch (error) {
			console.log(
				`Error al buscar producto con el id solicitado: ${error.message}`
			);
		}
	}

	async addProduct(product) {
		const productsFile = await this.getProducts();
		// const id = this.#idGenerator(productsFile);
		const newProduct = {
			// id,
			title: product.title,
			description: product.description,
			price: product.price,
			thumbnail: product.thumbnail,
			code: product.code,
			stock: product.stock,
			status: true,
			category: product.category,
		};

		if (productsFile.some((pCode) => pCode.code === product.code)) {
			return 'Code already exist';
		} else if (
			!product.title ||
			!product.description ||
			!product.price ||
			!product.code ||
			!product.stock ||
			!product.status ||
			!product.category
		) {
			return 'Incompleted fields';
		} else {
			// productsFile.push(newProduct);
			const newProduct = await productsModel.create(product);
			return newProduct;
		}
	}

	async updateProduct(idProd, product) {
		try {
			const productsFile = await this.getProducts();
			if (productsFile) {
				await productsModel.findOneAndUpdate({ _id: idProd }, product);
				const updatedProduct = await this.getProductById(idProd);
				return updatedProduct + console.log('Product updated');
			} else {
				throw new Error(`Product not found`);
			}
		} catch (error) {
			console.log(`Error modifying product ${idProd}: ${error.message}`);
		}
	}

	async deleteProducts() {
		try {
			await productsModel.deleteMany();
			return 'Products deleted';
		} catch (error) {
			console.log('No products found');
		}
	}

	async deleteProductById(id) {
		try {
			const deletedProduct = await this.getProductById(id);
			if (deletedProduct) {
				await productsModel.deleteOne({ _id: id });
				return 'Product deleted';
			} else {
				throw new Error(`Product ${id} doesn't exist`);
			}
		} catch (error) {
			console.log(
				`Error al eliminar el producto con el id solicitado: ${error.message}`
			);
		}
	}

	// #idGenerator = (products) => {
	// 	let id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
	// 	return id;
	// };
}
