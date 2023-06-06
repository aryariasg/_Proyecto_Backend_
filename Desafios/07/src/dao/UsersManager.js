import { usersModel } from '../db/models/users.model.js';

// creamos clase para exportar funcionalidades
export default class UsersManager {
	//
	async createUser(user) {
		const { email } = user;
		try {
			// lo primero es chequear si existe el usuario
			const existeUsuario = await usersModel.findOne({
				email,
			});
			// si no existe el usuario, lo crea
			if (existeUsuario) {
				throw new Error(`El usuario ${email} ya existe`);
			} else {
				// //console.log(user);
				const { email, password } = user;
				user.role = (await this.isAdmin({ email, password }))
					? 'admin'
					: 'usuario';
				const newUser = await usersModel.create({
					...user,
					password,
				});
				return newUser;
			} //
		} catch (error) {
			// //console.log(error);
			throw new Error(error);
		}
	}

	async findUserByEmail(email) {
		return await usersModel.findOne({ email });
	}

	isAdmin({ email, password }) {
		return email === 'adminCoder@coder.com' && password === 'adminCod3r123';
	}

	async loginUser({ email, password }) {
		const usuario = await usersModel.findOne({ email, password });
		if (usuario) {
			return usuario;
		} else {
			return null;
		}
	}
}
