import { Router } from 'express';
import UsersManager from '../dao/UsersManager.js';
const router = Router();
import { hashData, compareData } from '../utils.js';
import passport from 'passport';

const usersManager = new UsersManager();

//
// MONGOSTORE
//

// router.post('/', async (req, res) => {
// 	const { email, password } = req.body;
// 	const user = await usersModel.findOne({ email, password });
// 	if (!user) {
// 		return res.json({ message: 'user not found' });
// 	}
// 	req.session['username'] = email;
// 	req.session['password'] = password;
// 	req.session['logged'] = true;
// 	res.json({ message: 'user found' });
// });

//
// REGISTRO
//

router.post(
	'/registro',
	passport.authenticate('registro', {
		failureRedirect: '/views/errorRegistro',
		successRedirect: '/views',
	})
);

// router.post('/registro', passport.authenticate('registro'), (req, res) => {
// 	//console.log(req.user);
// 	res.send('User created');
// });

// router.post('/registro', async (req, res) => {
// 	const newUser = await usersManager.createUser(req.body);
// 	if (newUser) {
// 		res.redirect('/views');
// 	} else {
// 		res.redirect('/views/errorRegistro');
// 	}
// });

// router.post('/registro', async (req, res) => {
// 	const user = req.body;
// 	const hashPassword = await hashData(user.password); // metodo para hashear la contraseá
// 	const newUser = { ...user, password: hashPassword };
// 	await usersManager.createUser(newUser);
// 	if (newUser) {
// 		res.redirect('/views');
// 	} else {
// 		res.redirect('/views/errorRegistro');
// 	}
// });

//
// LOGIN
//

//
// LOGIN
//

router.post(
	'/login',
	passport.authenticate('login', {
		failureRedirect: '/views/errorLogin',
		successRedirect: '/views/realtimeproducts',
	})
);

//
// JWT
//

/*
router.post(
	'/login',
	passport.authenticate('jwt', {
		failureRedirect: '/views/errorLogin',
		successRedirect: '/views/realtimeproducts',
	})
);
*/

//
// CURRENT
//

router.get("/current")



// router.post('/login', async (req, res) => {
// 	const { email, password } = req.body;
// 	//
// 	const authorized = await usersManager.loginUser({ email, password });
// 	if (!authorized) {
// 		res.redirect('/views/errorLogin');
// 	}
// 	// Tengo problemas con esto
// 	const isPassword = await compareData(password, email.password);
// 	if (!isPassword) {
// 		res.redirect('/views/errorLogin');
// 	} else {
// 		req.session.email = authorized.email;
// 		req.session.role = authorized.role;
// 		res.redirect('/views/realtimeproducts');
// 	}
// });

// router.post('/login', async (req, res) => {
// 	const { email, password } = req.body;
// 	const user = await usersManager.loginUser(req.body);

// 	if (!user) {
// 		return res.json({ message: 'not found' });
// 	}
// 	const isPassword = await compareData(password, user.password);
// 	if (!isPassword) {
// 		res.json({ message: 'password not found ' });
// 	}
// 	if (user) {
// 		req.session.email = email;
// 		req.session.password = password;
// 		res.redirect('/views/perfil');
// 	} else {
// 		res.redirect('/views/errorLogin');
// 	}
// });

//
// GITHUB
//

router.post(
	'/registro',
	passport.authenticate('github', {
		failureRedirect: '/views/errorLogin',
		successRedirect: '/views/realtimeproducts',
	})
);

//
// LOGOUT
//

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) return next(err);
		res.redirect('/views');
	});
});
export default router;



