import { Router } from 'express';
import { PdfController } from '../controllers/PdfController';

const router = Router();
const pdfController = new PdfController();

// GET /api/pdf/horarios - Generar PDF con todos los horarios
router.get('/horarios', (req, res) => pdfController.generateHorariosPdf(req, res));

export default router;

