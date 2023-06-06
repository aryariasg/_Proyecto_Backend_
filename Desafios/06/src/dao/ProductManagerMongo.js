import { productsModel } from '../db/models/products.model.js';

export default class ProductManager {
	// async getProducts() {
	// 	try {
	// 		const products = await productsModel.find().lean();
	// 		return products;
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	async getProducts(limit, page, sort, query) {
		try {
			// const allProducts = await productsModel.find();

			const search = query
				? {
						stock: { $gt: 0 },
						$or: [
							//devuelve todos los productos que tengan el query en el titulo o en la categoria
							{ category: { $regex: query, $options: 'i' } },
							{ title: { $regex: query, $options: 'i' } },
						],
				  }
				: {
						//devuelve todos los productos que tengan stock mayor a 0
						stock: { $gt: 0 },
				  };

			if (sort === 'asc') {
				sort = { price: 1 };
			} else if (sort === 'desc') {
				sort = { price: -1 };
			}

			const options = {
				page: page || 1,
				limit: limit || 10,
				sort: sort,
				lean: true,
			};

			const products = await productsModel.paginate(search, options);
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
		// const productsFile = await this.getProducts();
		// const id = this.#idGenerator(productsFile);
		// const newProduct = {
		// 	// id,
		// 	title: product.title,
		// 	description: product.description,
		// 	price: product.price,
		// 	thumbnail: product.thumbnail,
		// 	code: product.code,
		// 	stock: product.stock,
		// 	status: true,
		// 	category: product.category,
		// };

		// if (productsFile.some((pCode) => pCode.code === product.code)) {
		// 	return 'Code already exist';
		// } else if (
		// 	!product.title ||
		// 	!product.description ||
		// 	!product.price ||
		// 	!product.code ||
		// 	!product.stock ||
		// 	!product.status ||
		// 	!product.category
		// ) {
		// 	return 'Incompleted fields';
		// } else {
		// 	// productsFile.push(newProduct);
		// 	const newProduct = await productsModel.create(product);
		// 	return newProduct;
		// }
		try {
			const newProduct = new productsModel(product);
			await newProduct.save();
			return newProduct;
		} catch (error) {
			console.log(error);
		}
	}

	async updateProduct(idProd, product) {
		// try {
		// 	const productsFile = await this.getProducts();
		// 	if (productsFile) {
		// 		await productsModel.findOneAndUpdate({ _id: idProd }, product);
		// 		const updatedProduct = await this.getProductById(idProd);
		// 		return updatedProduct + console.log('Product updated');
		// 	} else {
		// 		throw new Error(`Product not found`);
		// 	}
		// } catch (error) {
		// 	console.log(`Error modifying product ${idProd}: ${error.message}`);
		// }
		try {
			const updatedProduct = await productsModel.findOneAndUpdate(
				idProd,
				product,
				{
					new: true,
				}
			);
			return updatedProduct;
		} catch (error) {
			console.log(error);
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

	async paginateFun(limit, page) {
		try {
			const result = await usersModel.paginate({ limit, page }); // limit => cantidad de objetos por busqueda, page => pagina en la que realiza la busqueda
			const info = {
				count: result.totalDocs,
				page: result.totalPages,
				next: result.hasNextPage
					? `http://localhost:8080/users/paginate?page=${result.nextPage}`
					: null,
				prev: result.hasPrevPage
					? `http://localhost:8080/users/paginate?page=${result.prevPage}`
					: null,
			};
			return { info, results: result.docs };
		} catch (error) {
			console.log(error);
		}
	}
	// #idGenerator = (products) => {
	// 	let id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
	// 	return id;
	// };
}
