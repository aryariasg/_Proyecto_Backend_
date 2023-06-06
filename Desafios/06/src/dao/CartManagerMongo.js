import { cartsModel } from '../db/models/carts.model.js';

export default class CartManager {
	async createCart() {
		try {
			const cart = await cartsModel.create({});
			return cart;
		} catch (error) {
			console.log(`Cart not found: ${error.message}`);
		}
		// const cartsFile = await this.getCarts();
		// const newCart = {
		// 	id: this.#idGenerator(cartsFile),
		// 	products: [],
		// };c
		// cartsFile.push(newCart);
		// await cartsModel.create(cartsFile);
		// return newCart;
	}

	async getCarts() {
		try {
			const carts = await cartsModel.find().populate('products.product');
			return carts;
		} catch (error) {
			console.log(error);
		}
	}

	//  async getCart(id) {
	// 	const cartsFile = await this.getCarts();
	// 	const cart = cartsFile.find((cart) => cart.id === id);
	// 	if (cart) {
	// 		return cart;
	// 	} else {
	// 		return null;
	// 	}
	// }

	async getCart(id) {
		try {
			const cart = await cartsModel
				.findOne({ _id: id })
				.populate('products.product')
				.lean();
			if (!cart) {
				throw new Error(`No existe.`);
			} else {
				return cart;
			}
		} catch (error) {
			console.log(
				`Error buscando el carrito con el id solicitado: ${error.message}`
			);
		}
	}

	async addProductToCart(cid, pid) {
		try {
			const cart = await cartsModel.findOneAndUpdate(
				{ _id: cid, 'products.product': pid },
				{ $inc: { 'products.$.quantity': 1 } },
				{ new: true }
			);
			if (!cart) {
				const cart = await cartsModel.findOneAndUpdate(
					{ _id: cid },
					{ $addToSet: { products: { product: pid, quantity: 1 } } },
					{ new: true }
				);
				return cart;
			}
			return cart;
		} catch (error) {
			console.log(`Error agregando producto al carrito: ${error.message}`);
		}
	}

	async deleteCart(id) {
		try {
			const cart = await this.getCart(id);
			if (!cart) {
				throw new Error(`No se encontro carrito con el id solicitado.`);
			} else {
				await cartsModel.findOneAndDelete({ _id: id }, { new: true });
				return 'Carrito eliminado correctamente';
			}
		} catch (error) {
			console.log(`Error eliminando el carrito: ${error.message}`);
		}
	}

	async deleteProductFromCart(cartId, productId) {
		try {
			const cart = await cartsModel.findById(cartId);
			if (!cart) {
				return null;
			}

			const product = cart.products.find(
				(product) => product.pid.toString() === productId
			);
			if (!product) {
				return null;
			}

			if (product.quantity > 1) {
				product.quantity--;
				await cart.updateOne({ products: cart.products });
			} else {
				cart.products = cart.products.filter(
					(product) => product.pid.toString() !== productId
				);
				await cart.updateOne({ products: cart.products });
			}

			return cart;
		} catch (error) {
			console.log(error);
		}
	}

	// async deleteProductFromCart(cid, pid) {
	// 	try {
	// 		const cart = await this.getById(cid);
	// 		const quantity = cart.products.find((item) => item.product._id).quantity;
	// 		if (quantity > 1) {
	// 			const cart = await cartsModel.findOneAndUpdate(
	// 				{ _id: cid, 'products.product': pid },
	// 				{ $set: { 'products.$.quantity': quantity - 1 } },
	// 				{ new: true }
	// 			);
	// 			return cart;
	// 		} else {
	// 			const cart = await cartsModel.findOneAndUpdate(
	// 				{ _id: cid },
	// 				{ $pull: { products: { product: pid } } },
	// 				{ new: true }
	// 			);
	// 			return cart;
	// 		}
	// 	} catch (error) {
	// 		console.log(`Error eliminando producto del carrito: ${error.message}`);
	// 	}
	// }

	async deleteAllProductsFromCart(cartId) {
		try {
			const cart = await cartsModel.findById(cartId);
			if (!cart) {
				return null;
			}

			cart.products = [];

			await cart.updateOne({ products: cart.products });

			return cart;
		} catch (error) {
			console.log(error);
		}
	}

	async updateAllProductsFromCart(cartId, products) {
		try {
			const cart = await cartsModel.findById(cartId);
			if (!cart) {
				return null;
			}

			// verificar que los productos existan
			for (const product of products) {
				const pro = await productsModel.findById(product.pid);
				if (!pro) {
					return null;
				}
			}

			cart.products = products;

			await cart.updateOne({ products: cart.products });

			return cart;
		} catch (error) {
			console.log(error);
		}
	}

	async updateProductQuantityFromCart(cartId, productId, quantity) {
		try {
			const cart = await cartsModel.findById(cartId);
			if (!cart) {
				return null;
			}

			const product = cart.products.find(
				(product) => product.pid.toString() === productId
			);
			if (!product) {
				return null;
			}

			product.quantity = quantity;

			await cart.updateOne({ products: cart.products });

			return cart;
		} catch (error) {
			console.log(error);
		}
	}
}
