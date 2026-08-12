import { Router } from 'express';
import * as project from '../controllers/projectController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalProtect, project.listProjects);
router.get('/:slug', optionalProtect, project.getProjectBySlug);
router.post('/', protect, project.createProject);
router.put('/:id', protect, project.updateProject);
router.delete('/:id', protect, authorize('admin'), project.deleteProject);

export default router;