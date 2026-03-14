import { Request, Response } from 'express';
import { FichaService } from '../services/FichaService';
import { CreateFichaDto } from '../dto/CreateFichaDto';
import { UpdateFichaDto } from '../dto/UpdateFichaDto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class FichaController {
  private readonly fichaService: FichaService;

  constructor() {
    this.fichaService = new FichaService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const fichas = await this.fichaService.findAll();
      
      res.json({
        success: true,
        data: fichas,
        count: fichas.length
      });
    } catch (error) {
      console.error('Error al obtener fichas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener las fichas'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ficha = await this.fichaService.findById(parseInt(id));

      if (!ficha) {
        res.status(404).json({
          success: false,
          error: 'Ficha no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: ficha
      });
    } catch (error) {
      console.error('Error al obtener ficha:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener la ficha'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createFichaDto = plainToInstance(CreateFichaDto, req.body);
      const errors = await validate(createFichaDto);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const ficha = await this.fichaService.create(createFichaDto);

      res.status(201).json({
        success: true,
        data: ficha,
        message: 'Ficha creada exitosamente'
      });
    } catch (error: any) {
      console.error('Error al crear ficha:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateFichaDto = plainToInstance(UpdateFichaDto, req.body);
      const errors = await validate(updateFichaDto);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const ficha = await this.fichaService.update(parseInt(id), updateFichaDto);

      if (!ficha) {
        res.status(404).json({
          success: false,
          error: 'Ficha no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: ficha,
        message: 'Ficha actualizada exitosamente'
      });
    } catch (error: any) {
      console.error('Error al actualizar ficha:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.fichaService.delete(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Ficha no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Ficha eliminada exitosamente'
      });
    } catch (error: any) {
      console.error('Error al eliminar ficha:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}
