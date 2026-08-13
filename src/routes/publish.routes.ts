import { Router } from 'express';
import { postPublish, postPreview } from '../controllers/publishController';

const router = Router();

router.post('/publish', (req, res, next) => {
  void postPublish(req, res).catch(next);
});

router.post('/preview', (req, res, next) => {
  try {
    postPreview(req, res);
  } catch (e) {
    next(e);
  }
});

export default router;
