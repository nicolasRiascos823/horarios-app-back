import { Router } from 'express';
import { FichaController } from '../controllers/FichaController';

const router = Router();
const fichaController = new FichaController();

// GET /api/fichas - Obtener todas las fichas
router.get('/', (req, res) => fichaController.getAll(req, res));

// GET /api/fichas/:id - Obtener una ficha por ID
router.get('/:id', (req, res) => fichaController.getById(req, res));

// POST /api/fichas - Crear nueva ficha
router.post('/', (req, res) => fichaController.create(req, res));

// PUT /api/fichas/:id - Actualizar ficha
router.put('/:id', (req, res) => fichaController.update(req, res));

// DELETE /api/fichas/:id - Eliminar ficha
router.delete('/:id', (req, res) => fichaController.delete(req, res));

export default router;