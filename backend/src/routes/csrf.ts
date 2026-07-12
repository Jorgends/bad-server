import { Router } from 'express';
import csrfProtection from '../middlewares/csrf';

const router = Router();

router.get('/', csrfProtection, (req, res) => {
    res.json({
        csrfToken: req.csrfToken(),
    });
});

export default router;