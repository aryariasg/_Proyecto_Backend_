import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'; // se renombra para poder diferenciarlo
import { Strategy as GithubStrategy } from 'passport-github2';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'; // se renombra para poder diferenciarlo
import { usersModel } from '../db/models/users.model.js';
import { hashData, compareData } from '../utils.js';
import UsersManager from '../dao/UsersManager.js';

const usersManager = new UsersManager();

const secretKeyJWT = 'secretJWT';

//
// REGISTRO
//

passport.use(
	'registro',
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				await usersManager.findUserByEmail(email);
				const hashPassword = await hashData(password);
				const newUser = { ...req.body, password: hashPassword };
				const newUserDB = await usersManager.createUser(newUser);
				done(null, newUserDB);
			} catch (error) {
				console.log(error);
				return done(null, false);
			}
		}
	)
);

// configurar passport para usar una estrategia local (para autenticar usuarios con email y contraseña)
// passport.use(
// 	'Register',
// 	new LocalStrategy(
// 		{
// 			usernameField: 'email',
// 			passwordField: 'password',
// 			passReqToCallback: true,
// 		},
// 		async (req, email, password, done) => {
// 			const user = await usersModel.findOne({ email });
// 			if (user) {
// 				return done(null, false, {
// 					message: 'Email already registered',
// 				});
// 			}
// 			const newUser = new usersModel({
// 				email,
// 				password: await hashData(password),
// 				first_name: req.body.first_name,
// 			});
// 			await newUser.save();
// 			return done(null, newUser);
// 		}
// 	)
// );

//
// LOGIN
//

passport.use(
	'login',
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		async (email, password, done) => {
			const user = await usersManager.findUserByEmail(email);
			if (!user) {
				return done(null, false);
			}
			const isPassword = await compareData(password, user.password);
			if (!isPassword) {
				return done(null, false);
			}
			done(null, user);
		}
	)
);

//
// GITHUB
//

// configurar passport para usar una estrategia con github (para autenticar usuarios con github)
passport.use(
	'github',
	new GithubStrategy(
		{
			clientID: 'Iv1.37b5c0aea6358b78',
			clientSecret: '9bf60de2a487b2634c4c1c757694b315a05ef8dc',
			callbackURL: 'http://localhost:8080/users/github',
		},
		async (accessToken, refreshToken, profile, done) => {
			// //console.log(profile);

			try {
				const email = profile._json.email;
				await usersManager.findUserByEmail(email);
				const newUser = {
					first_name: profile._json.name, //.split(' ')[0],
					email,
					password: '',
				};
				const newUserDB = await usersModel.createUser(newUser);
				done(null, newUserDB);
			} catch (error) {
				done(null, false);
			}
		}
	)
);

//
// JWT
//
passport.use(
	'jwt',
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: secretKeyJWT,
		},
		async (jwt_payload, done) => {
			console.log('JWT', jwt_payload);
			// done(null, jwt_payload);
		}
	)
);

//independientemente de la estrategia hay que crear 2 funcions

passport.serializeUser((user, done) => {
	try {
		done(null, user.id);
	} catch (error) {
		done(error);
	}
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await usersModel.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
