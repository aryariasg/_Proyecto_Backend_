class ProductManager {
	#idGenerator() {
		const id = this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1;
		return id;
	}

	constructor() {
		this.products = [];
	}

	getProducts() {
		return this.products;
	}

	getProductById(id) {
		const productById = this.products.find((pid) => pid.id === id);
		const pError = `Error: Producto ${id} no encontrado`;

		if (productById) {
			return productById
			//`Producto encontrado: ${productById}`;
		} else {
			return pError;
		}
	}

	addProduct(title, description, price, thumbnail, code, stock) {
		const product = {
			title,
			description,
			price,
			thumbnail,
			code, 
			stock,
			id: this.#idGenerator(),
		};

		if (this.products.some((pCode) => pCode.code === product.code)) {
			return console.log("Error: El código del producto ya existe");
		}

		if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
			console.log("Error: Todos los campos son obligatorios");
			return;
		}

		this.products.push(product);
	}
}

const manager = new ProductManager();

manager.addProduct("Jamon", "Mediterraneo", 500, "thumbnail", 1, 10);
console.log(manager.getProducts());

manager.addProduct("Jamon", "Crudo", 350, "thumbnail", 1, 5); // Code repetido => no se suma al array + retorna mensaje de Error

manager.addProduct("Queso", "Suizo", 600, "thumbnail", 2, 15);
console.log(manager.getProducts());

manager.addProduct("Pan", "Arabe", 750, "thumbnail", 3, 20);
manager.addProduct("Mayonesa", "Orgánica", 430, "thumbnail", 4, 25);
console.log(manager.getProducts());

console.log(manager.getProductById(4));
console.log(manager.getProductById(8));

manager.addProduct("Huevo", "", 150, "thumbnail", 5, 50); // Falta descripcion => no se suma al array + retorna mensaje de Error
console.log(manager.getProducts());
