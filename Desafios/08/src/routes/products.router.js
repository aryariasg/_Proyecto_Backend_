import { Router } from 'express';
//import ProductManager from '../dao/ProductManager.js';
import ProductManager from '../dao/ProductManagerMongo.js';
import { __dirname } from '../utils.js';

// const productManager = new ProductManager(__dirname + '/Products.json');
const productManager = new ProductManager(); // MongoDB

const router = Router();

// router.get('/', async (req, res) => {
// 	const limit = req.query.limit;
// 	const products = await productManager.getProducts();
// 	if (limit) {
// 		const limitedProducts = products.slice(0, limit);
// 		res.json(limitedProducts);
// 	} else {
// 		res.json({ products });
// 	}
// });

router.get('/', async (req, res) => {
	try {
		const { limit, page, sort, query } = req.query;

		const products = await productManager.getProducts(limit, page, sort, query);

		products.docs = products.docs.map((product) => {
			const {
				_id,
				title,
				description,
				price,
				code,
				stock,
				category,
				thumbnail,
			} = product;
			return {
				id: _id,
				title,
				description,
				price,
				code,
				stock,
				category,
				thumbnail,
			};
		});

		const info = {
			totalPages: products.totalPages,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: products.hasPrevPage
				? `http://localhost:8080/api/products?page=${products.prevPage}`
				: null,
			nextLink: products.hasNextPage
				? `http://localhost:8080/api/products?page=${products.nextPage}`
				: null,
		};

		res.status(200).send({ status: 'success', payload: products.docs, info });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ status: 'error', error: 'Error obtaining products' });
	}
});

// router.get('/paginate', async (req, res) => {
// 	const { limit = 15, page = 1 } = req.query;
// 	const response = await usersManager.paginateFun(limit, page);
// 	res.json({ response });
// });

router.get('/:pid', async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await productManager.getProductById(pid);
		res.json({ product });

		if (product) {
			res.status(200).send({ status: 'success', payload: product });
		} else {
			res.status(404).send({ status: 'error', error: 'Product not found' });
		}
	} catch (error) {
		//console.log(error);
		res.status(500).send({ status: 'error', error: 'Error obtaining product' });
	}
});

router.post('/', async (req, res) => {
	try {
		const obj = req.body;
		const newProduct = await productManager.addProduct(obj);
		res.json({ newProduct });
		if (newProduct) {
			res.status(201).send({ status: 'success', payload: newProduct });
		}
	} catch (error) {
		//console.log(error);
		res.status(500).send({ status: 'error', error: 'Error creating product' });
	}
});

router.put('/:pid', async (req, res) => {
	try {
		const { pid } = req.params;
		const obj = req.body;
		const product = await productManager.updateProduct(pid, obj);
		res.json({ product });
		if (product) {
			res.status(201).send({ status: 'success', payload: updatedProduct });
		} else {
			res.status(404).send({ status: 'error', error: 'Product not found' });
		}
	} catch (error) {
		//console.log(error);
		res.status(500).send({ status: 'error', error: 'Error updating product' });
	}
});

router.delete('/', async (req, res) => {
	try {
		const deleteProducts = await productManager.deleteProducts();
		res.json({ deleteProducts });
	} catch (error) {
		//console.log(error);
		res.status(500).send({ status: 'error', error: 'Error deleting products' });
	}
});

router.delete('/:pid', async (req, res) => {
	try {
		const { pid } = req.params;
		const deleteProduct = await productManager.deleteProductById(pid);
		res.json({ deleteProduct });
		if (deleteProduct) {
			res.status(201).send({ status: 'success', payload: deleteProduct });
		} else {
			res.status(404).send({ status: 'error', error: 'Product not found' });
		}
	} catch (error) {
		//console.log(error);
		res.status(500).send({ status: 'error', error: 'Error deleting product' });
	}
});

export default router;
