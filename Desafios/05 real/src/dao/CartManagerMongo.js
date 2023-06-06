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
			const carts = await cartsModel.find();
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

	// const cart = await this.getCart(cid);
	// if (!cart) return 'Cart doesnt exist';
	// // validar que el producto exista

	// if (pid <= 0) {
	// 	return 'Ivalid product ID';
	// } else {
	// 	const productIndex = cart.products.findIndex((p) => p.product === pid);
	// 	if (productIndex === -1) {
	// 		cart.products.push({ product: pid, quantity: 1 });
	// 	} else {
	// 		cart.products[productIndex].quantity++;
	// 	}
	// }

	// 	const cartsFile = await this.getCarts();
	// 	const cartIndex = cartsFile.findIndex((c) => c.id === cid);
	// 	cartsFile.splice(cartIndex, 1, cart);
	// 	await cartsModel.create(cartsFile);
	// 	return 'Product added';
	//}
}
