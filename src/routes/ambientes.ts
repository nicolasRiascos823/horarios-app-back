import { Router } from 'express';
import { AmbienteController } from '../controllers/AmbienteController';

const router = Router();
const ambienteController = new AmbienteController();

// GET /api/ambientes - Obtener todos los ambientes
router.get('/', (req, res) => ambienteController.getAll(req, res));

// GET /api/ambientes/:id - Obtener un ambiente por ID
router.get('/:id', (req, res) => ambienteController.getById(req, res));

// POST /api/ambientes - Crear nuevo ambiente
router.post('/', (req, res) => ambienteController.create(req, res));

// PUT /api/ambientes/:id - Actualizar ambiente
router.put('/:id', (req, res) => ambienteController.update(req, res));

// DELETE /api/ambientes/:id - Eliminar ambiente
router.delete('/:id', (req, res) => ambienteController.delete(req, res));

export { router as default };