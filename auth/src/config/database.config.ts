//src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'authdb',
  synchronize: false,
  entities: ['dist/**/*.entity.js'], // Путь для скомпилированных сущностей
  migrations: ['dist/migrations/*.js'], // Путь для скомпилированных миграций
  migrationsRun: true, // Автоматический запуск миграций
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
};
