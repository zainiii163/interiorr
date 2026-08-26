import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as project from '../controllers/projectController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { validateProject } from '../middleware/validate.js';

const router = Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', optionalProtect, project.listProjects);
router.get('/:slug', optionalProtect, project.getProjectBySlug);
router.post('/', protect, writeLimiter, validateProject, project.createProject);
router.put('/:id', protect, writeLimiter, project.updateProject);
router.delete('/:id', protect, authorize('admin'), project.deleteProject);

export default router;
