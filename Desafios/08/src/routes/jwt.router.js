import { Router } from 'express';
import UsersManager from '../dao/UsersManager.js';
import { generateToken } from '../utils.js';
import { usersModel } from '../db/models/users.model.js';
import { jwtValidation } from '../middlewares/jwt.middleware.js';
import passport from 'passport';

const router = Router();
const usersManager = new UsersManager();

router.post('/login', async (req, res) => {
	const { email } = req.body;
	//const user = await usersManager.loginUser(email);
	const user = await usersModel.findOne({ email });

	if (!user) {
		return res.send('User not found');
	} else {
		const token = generateToken({ id: user._id, email });
		//res.send(token);
		res.json({ message: 'Login', token });
	}
});

router.get('/login', jwtValidation, async (req, res) => {
	// se envía en los headers del request, dentro de una propiedad llamada Autorization el token
	res.send(`User ${req.user.email} logged`);
});

// Existe la posibilidad de guardar el token de la sesion en Cookies

router.post('/loginCookies', jwtValidation, async (req, res) => {
	const { email } = req.body;
	//const user = await usersManager.loginUser(email);
	const user = await usersModel.findOne({ email });

	if (!user) {
		return res.send('User not found');
	} else {
		const token = generateToken({ id: user._id, email });
		res.cookie('token', token).json({ message: 'Login' });
	}
});

// router.get(
// 	'/loginPassport',
// 	passport.authenticate('jwt', { session: false }), // jwt es la alternativa a sessions
// 	(req, res) => {
// 		res.send(`User ${req.user.email} logged`);
// 	}
// );

export default router;
