import { Router } from 'express';
import { InstructorController } from '../controllers/InstructorController';

const router = Router();
const instructorController = new InstructorController();

// GET /api/instructores - Obtener todos los instructores
router.get('/', (req, res) => instructorController.getAll(req, res));

// GET /api/instructores/:id - Obtener un instructor por ID
router.get('/:id', (req, res) => instructorController.getById(req, res));

// POST /api/instructores - Crear nuevo instructor
router.post('/', (req, res) => instructorController.create(req, res));

// PUT /api/instructores/:id - Actualizar instructor
router.put('/:id', (req, res) => instructorController.update(req, res));

// DELETE /api/instructores/:id - Eliminar instructor
router.delete('/:id', (req, res) => instructorController.delete(req, res));

export { router as default };