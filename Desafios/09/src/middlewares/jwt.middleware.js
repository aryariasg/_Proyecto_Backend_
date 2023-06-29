// para desencriptar los datos del user
import jwt from 'jsonwebtoken';

const secretKeyJWT = 'secretJWT';

export const jwtValidation = (req, res, next) => {
	// console.log(req);
	//
	// propiedad para que nos de el valor de la prop autorization
	const authHeader = req.get('Authorization');
	// para quitar el Bearer
	const token = authHeader.split(' ')[1];
	//
	console.log(authHeader);
	// Verificar la informacion del usuario que llega del token
	// const verifiedUser = jwt.verify(token, 'secretKey'); // => da error porque la secretKey es incorrecta
	const verifiedUser = jwt.verify(token, secretKeyJWT);

	if (verifiedUser) {
		req.user = verifiedUser;
		next();
	} // envía la informacion del usuario => id e email que se solicitó en jwt.router
	next();
};

//

/*
// Validation con Cookie
export const jwtValidation = (req, res, next) => {
	console.log(req.cookies);
	const token = req.cookies.token;
	const verifiedUser = jwt.verify(token, secretKeyJWT);
	if (verifiedUser) {
		req.user = verifiedUser;
		next();
	}
};
*/
