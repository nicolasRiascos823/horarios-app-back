import { Request, Response } from 'express';
import { PdfService } from '../services/PdfService';

export class PdfController {
  private pdfService: PdfService;

  constructor() {
    this.pdfService = new PdfService();
  }

  async generateHorariosPdf(req: Request, res: Response): Promise<void> {
    try {
      const pdfBuffer = await this.pdfService.generateHorariosPdf();
      
      // Configurar headers para descarga de PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="horarios-sena-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error: unknown) {
      console.error('Error al generar PDF:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar el PDF'
      });
    }
  }
}

