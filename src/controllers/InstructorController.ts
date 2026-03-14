import { Request, Response } from 'express';
import { InstructorService } from '../services/InstructorService';
import { CreateInstructorDto } from '../dto/CreateInstructorDto';
import { UpdateInstructorDto } from '../dto/UpdateInstructorDto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class InstructorController {
  private readonly instructorService: InstructorService;

  constructor() {
    this.instructorService = new InstructorService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const instructores = await this.instructorService.findAll();
      
      res.json({
        success: true,
        data: instructores,
        count: instructores.length
      });
    } catch (error) {
      console.error('Error al obtener instructores:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener los instructores'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const instructor = await this.instructorService.findById(parseInt(id));

      if (!instructor) {
        res.status(404).json({
          success: false,
          error: 'Instructor no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: instructor
      });
    } catch (error) {
      console.error('Error al obtener instructor:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el instructor'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createInstructorDto = plainToInstance(CreateInstructorDto, req.body);
      const errors = await validate(createInstructorDto);

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

      const instructor = await this.instructorService.create(createInstructorDto);

      res.status(201).json({
        success: true,
        data: instructor,
        message: 'Instructor creado exitosamente'
      });
    } catch (error: any) {
      console.error('Error al crear instructor:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateInstructorDto = plainToInstance(UpdateInstructorDto, req.body);
      const errors = await validate(updateInstructorDto);

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

      const instructor = await this.instructorService.update(parseInt(id), updateInstructorDto);

      if (!instructor) {
        res.status(404).json({
          success: false,
          error: 'Instructor no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: instructor,
        message: 'Instructor actualizado exitosamente'
      });
    } catch (error: any) {
      console.error('Error al actualizar instructor:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.instructorService.delete(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Instructor no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Instructor eliminado exitosamente'
      });
    } catch (error: any) {
      console.error('Error al eliminar instructor:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}
