const socketClient = io();

const addProduct = document.getElementById('addProduct');

const inputTitle = document.getElementById('productTitle');
const inputDescription = document.getElementById('productDescription');
const inputPrice = document.getElementById('productPrice');
const inputThumbnail = document.getElementById('productThumbnail');
const inputCode = document.getElementById('productCode');
const inputStock = document.getElementById('productStock');
const inputStatus = document.getElementById('productStatus');
const inputCategory = document.getElementById('productCategory');

const products = socketClient.on('products', (products) => {
	return products + console.log(products.docs);
});

addProduct.addEventListener('click', (e) => {
	const newProduct = {
		title: inputTitle.value,
		description: inputDescription.value,
		price: parseInt(inputPrice.value),
		thumbnail: [],
		code: parseInt(inputCode.value),
		stock: parseInt(inputStock.value),
		status: true,
		category: inputCategory.value,
	};
	if (
		!newProduct.title ||
		!newProduct.description ||
		!newProduct.price ||
		!newProduct.code ||
		!newProduct.stock ||
		!newProduct.status ||
		!newProduct.category
	) {
		//e.preventDefault();
		return console.log('Incompleted fields') + document.reload();
	} else {
		socketClient.emit('newProduct', newProduct);
		document.location.reload();
	}
});

// const deleteProduct = document.getElementById("deleteProduct")
const deleteProduct = document.querySelector('#productsTable');

deleteProduct.addEventListener('click', (e) => {
	//e.preventDefault();
	const element = e.target;
	const productId = element.getAttribute('data-id');
	if (element.className === 'classDeleteProduct') {
		socketClient.emit('deleteProduct', productId);
		console.log(productId);
		document.location.reload();
	}
});
