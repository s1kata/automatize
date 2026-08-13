import { Router } from 'express';
import { getTours } from '../controllers/tourController';

const router = Router();

router.get('/', (req, res, next) => {
  void getTours(req, res).catch(next);
});

export default router;
