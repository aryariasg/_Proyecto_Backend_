import { Router } from 'express';

const router = Router();

router.get('/current', (req, res) => {
	// res.send(req.session);
	console.log(req.session);
});

export default router;
