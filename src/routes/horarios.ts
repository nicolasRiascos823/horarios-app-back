import { Router } from 'express';
import { HorarioController } from '../controllers/HorarioController';

const router = Router();
const horarioController = new HorarioController();

// GET /api/horarios - Obtener todos los horarios
router.get('/', (req, res) => horarioController.getAll(req, res));

// GET /api/horarios/:id - Obtener un horario por ID
router.get('/:id', (req, res) => horarioController.getById(req, res));

// POST /api/horarios - Crear nuevo horario
router.post('/', (req, res) => horarioController.create(req, res));

// PUT /api/horarios/:id - Actualizar horario
router.put('/:id', (req, res) => horarioController.update(req, res));

// DELETE /api/horarios/:id - Eliminar horario
router.delete('/:id', (req, res) => horarioController.delete(req, res));

// GET /api/horarios/matriz/:fichaId - Obtener matriz de horarios para una ficha
router.get('/matriz/:fichaId', (req, res) => horarioController.getMatriz(req, res));

export { router as default };