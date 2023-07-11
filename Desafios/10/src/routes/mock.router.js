import { Router } from 'express';
import { faker } from '@faker-js/faker';

const router = Router();

function makeCode(length) {
	const characters = '0123456789';
	const charactersLength = characters.length;

	let result = '';
	let counter = 0;

	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}

	return result;
}

router.get('/', async (req, res) => {
	try {
		const productsMock = Array(100)
			.fill(null)
			.map(() => ({
				title: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				price: faker.commerce.price(),
				thumbnail: faker.image.url(),
				code: makeCode(5),
				stock: faker.number.int({ max: 10 }),
			}));
		res.status(200).json(productsMock);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
