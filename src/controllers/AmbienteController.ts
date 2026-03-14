import { Request, Response } from 'express';
import { AmbienteService } from '../services/AmbienteService';
import { CreateAmbienteDto } from '../dto/CreateAmbienteDto';
import { UpdateAmbienteDto } from '../dto/UpdateAmbienteDto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class AmbienteController {
  private readonly ambienteService: AmbienteService;

  constructor() {
    this.ambienteService = new AmbienteService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ambientes = await this.ambienteService.findAll();
      
      res.json({
        success: true,
        data: ambientes,
        count: ambientes.length
      });
    } catch (error) {
      console.error('Error al obtener ambientes:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener los ambientes'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ambiente = await this.ambienteService.findById(parseInt(id));

      if (!ambiente) {
        res.status(404).json({
          success: false,
          error: 'Ambiente no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: ambiente
      });
    } catch (error) {
      console.error('Error al obtener ambiente:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el ambiente'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createAmbienteDto = plainToInstance(CreateAmbienteDto, req.body);
      const errors = await validate(createAmbienteDto);

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

      const ambiente = await this.ambienteService.create(createAmbienteDto);

      res.status(201).json({
        success: true,
        data: ambiente,
        message: 'Ambiente creado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al crear ambiente:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateAmbienteDto = plainToInstance(UpdateAmbienteDto, req.body);
      const errors = await validate(updateAmbienteDto);

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

      const ambiente = await this.ambienteService.update(parseInt(id), updateAmbienteDto);

      if (!ambiente) {
        res.status(404).json({
          success: false,
          error: 'Ambiente no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: ambiente,
        message: 'Ambiente actualizado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al actualizar ambiente:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.ambienteService.delete(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Ambiente no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Ambiente eliminado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al eliminar ambiente:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
