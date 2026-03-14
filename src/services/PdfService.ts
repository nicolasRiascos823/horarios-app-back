import puppeteer from 'puppeteer';
import { HorarioRepository } from '../repositories/HorarioRepository';
import { FichaRepository } from '../repositories/FichaRepository';
import { Horario } from '../entities/Horario';

export class PdfService {
  private horarioRepository: HorarioRepository;
  private fichaRepository: FichaRepository;

  constructor() {
    this.horarioRepository = new HorarioRepository();
    this.fichaRepository = new FichaRepository();
  }

  async generateHorariosPdf(): Promise<Buffer> {
    // Obtener todas las fichas
    const fichas = await this.fichaRepository.findAll();
    
    // Crear HTML para el PDF
    const html = await this.generateHtml(fichas);
    
    // Iniciar Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(html);
      
      // Generar PDF
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20mm',
          right: '10mm',
          bottom: '20mm',
          left: '10mm'
        }
      });
      
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private async generateHtml(fichas: any[]): Promise<string> {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Horarios SENA</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #1976d2;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1976d2;
          margin: 0;
          font-size: 24px;
        }
        .header p {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 12px;
        }
        .ficha-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .ficha-title {
          background: #1976d2;
          color: white;
          padding: 10px;
          margin: 0 0 10px 0;
          font-size: 16px;
          font-weight: bold;
        }
        .ficha-info {
          background: #f5f5f5;
          padding: 8px;
          margin-bottom: 15px;
          font-size: 12px;
          color: #333;
        }
        .horario-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin-bottom: 20px;
        }
        .horario-table th {
          background: #1976d2;
          color: white;
          padding: 8px 4px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #1565c0;
        }
        .horario-table td {
          border: 1px solid #ddd;
          padding: 4px;
          text-align: center;
          vertical-align: middle;
          height: 30px;
        }
        .horario-table tr:nth-child(even) {
          background: #f9f9f9;
        }
        .horario-cell {
          background: #e3f2fd;
          border: 1px solid #1976d2;
          border-radius: 3px;
          padding: 2px;
          font-size: 9px;
          line-height: 1.2;
        }
        .instructor {
          font-weight: bold;
          color: #1976d2;
        }
        .ambiente {
          color: #666;
          font-size: 8px;
        }
        .duracion {
          color: #1976d2;
          font-size: 8px;
          font-weight: bold;
        }
        .no-horarios {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 20px;
        }
        .footer {
          position: fixed;
          bottom: 10px;
          left: 10px;
          right: 10px;
          text-align: center;
          font-size: 8px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HORARIOS SENA - TODAS LAS FICHAS</h1>
        <p>Generado el: ${new Date().toLocaleDateString('es-CO')}</p>
      </div>
    `;

    // Procesar cada ficha
    for (const ficha of fichas) {
      const horarios = await this.horarioRepository.findAll({ fichaId: ficha.id });
      const matriz = this.createHorarioMatrix(horarios);
      
      html += `
        <div class="ficha-section">
          <div class="ficha-title">${ficha.codigo} - ${ficha.nombre}</div>
          <div class="ficha-info">
            <strong>Programa:</strong> ${ficha.programa} | 
            <strong>Jornada:</strong> ${ficha.jornada}
          </div>
      `;

      if (horarios.length === 0) {
        html += '<div class="no-horarios">Sin horarios asignados</div>';
      } else {
        html += this.generateTableHtml(matriz);
      }

      html += '</div>';
    }

    html += `
      <div class="footer">
        Sistema de Horarios SENA - Página <span class="pageNumber"></span>
      </div>
    </body>
    </html>
    `;

    return html;
  }

  private generateTableHtml(matriz: any[][]): string {
    const horas = Array.from({ length: 16 }, (_, i) => i + 6);
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    let html = `
      <table class="horario-table">
        <thead>
          <tr>
            <th style="width: 60px;">Hora</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Sábado</th>
          </tr>
        </thead>
        <tbody>
    `;

    horas.forEach((hora, horaIndex) => {
      html += '<tr>';
      html += `<td><strong>${hora}:00</strong></td>`;
      
      dias.forEach((_, diaIndex) => {
        const horarioInfo = matriz[diaIndex][horaIndex];
        
        if (horarioInfo && horarioInfo.esInicio) {
          const instructor = `${horarioInfo.instructor.nombre.split(' ')[0]} ${horarioInfo.instructor.apellido.split(' ')[0]}`;
          const ambiente = horarioInfo.ambiente.codigo;
          const duracion = `${horarioInfo.duracion}h`;
          
          html += `
            <td rowspan="${horarioInfo.duracion}">
              <div class="horario-cell">
                <div class="instructor">${instructor}</div>
                <div class="ambiente">${ambiente}</div>
                <div class="duracion">${duracion}</div>
              </div>
            </td>
          `;
        } else if (!horarioInfo) {
          html += '<td></td>';
        }
        // Si es continuación, no agregamos celda (ya está cubierta por rowspan)
      });
      
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  private createHorarioMatrix(horarios: Horario[]): any[][] {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horas = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 a 21:00
    
    const matriz = Array(6).fill(null).map(() => Array(16).fill(null));
    
    horarios.forEach(horario => {
      const diaIndex = horario.diaSemana - 1;
      const horaIndex = horario.horaInicio - 6;
      
      for (let i = 0; i < horario.duracion; i++) {
        if (horaIndex + i < 16) {
          matriz[diaIndex][horaIndex + i] = {
            id: horario.id,
            instructor: horario.instructor,
            ambiente: horario.ambiente,
            duracion: horario.duracion,
            esInicio: i === 0
          };
        }
      }
    });

    return matriz;
  }

  private formatTableData(matriz: any[][]): string[][] {
    const horas = Array.from({ length: 16 }, (_, i) => i + 6);
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const tableData: string[][] = [];
    
    horas.forEach((hora, horaIndex) => {
      const row = [`${hora}:00`];
      
      dias.forEach((_, diaIndex) => {
        const horarioInfo = matriz[diaIndex][horaIndex];
        
        if (horarioInfo && horarioInfo.esInicio) {
          const instructor = `${horarioInfo.instructor.nombre.split(' ')[0]} ${horarioInfo.instructor.apellido.split(' ')[0]}`;
          const ambiente = horarioInfo.ambiente.codigo;
          const duracion = `${horarioInfo.duracion}h`;
          row.push(`${instructor}\n${ambiente}\n${duracion}`);
        } else if (horarioInfo) {
          row.push(''); // Celda vacía para continuación
        } else {
          row.push(''); // Celda vacía
        }
      });
      
      tableData.push(row);
    });
    
    return tableData;
  }
}
