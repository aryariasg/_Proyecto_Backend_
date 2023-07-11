import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
	return bcrypt.hash(data, 10);
};

export const compareData = async (data, dataDB) => {
	return bcrypt.compare(data, dataDB); // compara la data hasheada con la noHasheada
};

// secretKey para utilizar en JWT
const secretKeyJWT = 'secretJWT';

export const generateToken = (user) => {
	const token = jwt.sign(user, secretKeyJWT, { expiresIn: '1h' });
	return token;
};
