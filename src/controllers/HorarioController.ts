import { Request, Response } from 'express';
import { HorarioService } from '../services/HorarioService';
import { CreateHorarioDto } from '../dto/CreateHorarioDto';
import { UpdateHorarioDto } from '../dto/UpdateHorarioDto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class HorarioController {
  private readonly horarioService: HorarioService;

  constructor() {
    this.horarioService = new HorarioService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { fichaId, instructorId, ambienteId, diaSemana } = req.query;
      
      const filters: any = {};
      if (fichaId) filters.fichaId = parseInt(fichaId as string);
      if (instructorId) filters.instructorId = parseInt(instructorId as string);
      if (ambienteId) filters.ambienteId = parseInt(ambienteId as string);
      if (diaSemana) filters.diaSemana = parseInt(diaSemana as string);

      const horarios = await this.horarioService.findAll(filters);
      
      res.json({
        success: true,
        data: horarios,
        count: horarios.length
      });
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener los horarios'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const horario = await this.horarioService.findById(parseInt(id));

      if (!horario) {
        res.status(404).json({
          success: false,
          error: 'Horario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: horario
      });
    } catch (error) {
      console.error('Error al obtener horario:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el horario'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createHorarioDto = plainToInstance(CreateHorarioDto, req.body);
      const errors = await validate(createHorarioDto);

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

      const horario = await this.horarioService.create(createHorarioDto);

      res.status(201).json({
        success: true,
        data: horario,
        message: 'Horario creado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al crear horario:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateHorarioDto = plainToInstance(UpdateHorarioDto, req.body);
      const errors = await validate(updateHorarioDto);

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

      const horario = await this.horarioService.update(parseInt(id), updateHorarioDto);

      if (!horario) {
        res.status(404).json({
          success: false,
          error: 'Horario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: horario,
        message: 'Horario actualizado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al actualizar horario:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.horarioService.delete(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Horario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Horario eliminado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al eliminar horario:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getMatriz(req: Request, res: Response): Promise<void> {
    try {
      const { fichaId } = req.params;
      const result = await this.horarioService.getMatrizHorarios(parseInt(fichaId));

      res.json({
        success: true,
        data: result
      });
    } catch (error: unknown) {
      console.error('Error al obtener matriz de horarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener la matriz de horarios'
      });
    }
  }
}
