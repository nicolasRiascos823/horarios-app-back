import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla fichas
    await queryRunner.query(`
      CREATE TABLE \`fichas\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`codigo\` varchar(255) NOT NULL,
        \`nombre\` varchar(255) NOT NULL,
        \`programa\` varchar(255) NOT NULL,
        \`jornada\` enum('Diurna', 'Nocturna', 'Mixta') NOT NULL,
        \`createdAt\` datetime NOT NULL,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`IDX_fichas_codigo\` (\`codigo\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Crear tabla instructores
    await queryRunner.query(`
      CREATE TABLE \`instructores\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`documento\` varchar(255) NOT NULL,
        \`nombre\` varchar(255) NOT NULL,
        \`apellido\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`telefono\` varchar(255) NULL,
        \`especialidad\` varchar(255) NOT NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`IDX_instructores_documento\` (\`documento\`),
        UNIQUE INDEX \`IDX_instructores_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Crear tabla ambientes
    await queryRunner.query(`
      CREATE TABLE \`ambientes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`codigo\` varchar(255) NOT NULL,
        \`nombre\` varchar(255) NOT NULL,
        \`tipo\` varchar(255) NOT NULL,
        \`capacidad\` int NOT NULL,
        \`activo\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`IDX_ambientes_codigo\` (\`codigo\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Crear tabla horarios
    await queryRunner.query(`
      CREATE TABLE \`horarios\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fichaId\` int NOT NULL,
        \`instructorId\` int NOT NULL,
        \`ambienteId\` int NOT NULL,
        \`diaSemana\` int NOT NULL,
        \`horaInicio\` int NOT NULL,
        \`horaFin\` int NOT NULL,
        \`duracion\` int NOT NULL,
        \`createdAt\` datetime NOT NULL,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`IDX_horarios_instructor_dia_hora\` (\`instructorId\`, \`diaSemana\`, \`horaInicio\`),
        UNIQUE INDEX \`IDX_horarios_ambiente_dia_hora\` (\`ambienteId\`, \`diaSemana\`, \`horaInicio\`),
        UNIQUE INDEX \`IDX_horarios_ficha_dia_hora\` (\`fichaId\`, \`diaSemana\`, \`horaInicio\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Agregar foreign keys
    await queryRunner.query(`
      ALTER TABLE \`horarios\` 
      ADD CONSTRAINT \`FK_horarios_ficha\` 
      FOREIGN KEY (\`fichaId\`) REFERENCES \`fichas\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`horarios\` 
      ADD CONSTRAINT \`FK_horarios_instructor\` 
      FOREIGN KEY (\`instructorId\`) REFERENCES \`instructores\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`horarios\` 
      ADD CONSTRAINT \`FK_horarios_ambiente\` 
      FOREIGN KEY (\`ambienteId\`) REFERENCES \`ambientes\`(\`id\`) ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys
    await queryRunner.query(`ALTER TABLE \`horarios\` DROP FOREIGN KEY \`FK_horarios_ambiente\``);
    await queryRunner.query(`ALTER TABLE \`horarios\` DROP FOREIGN KEY \`FK_horarios_instructor\``);
    await queryRunner.query(`ALTER TABLE \`horarios\` DROP FOREIGN KEY \`FK_horarios_ficha\``);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE \`horarios\``);
    await queryRunner.query(`DROP TABLE \`ambientes\``);
    await queryRunner.query(`DROP TABLE \`instructores\``);
    await queryRunner.query(`DROP TABLE \`fichas\``);
  }
}

