import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: `.env`,
});

const config = {
  type: (process.env.PROJECT_DB_CONNECTION ??
    'postgres') as PostgresConnectionOptions['type'],
  host: process.env.REPORTING_DATABASE_HOST || 'localhost',
  port: parseInt(process.env.REPORTING_DATABASE_PORT || '5432'),
  username: process.env.REPORTING_DATABASE_USERNAME || 'postgres',
  password: process.env.REPORTING_DATABASE_PASSWORD || 'postgres',
  database: process.env.REPORTING_DATABASE_DATABASE || 'zurich_db',
  ssl: process.env.PROJECT_DB_SSL_CERT
    ? {
        rejectUnauthorized: true,
        ca: process.env.PROJECT_DB_SSL_CERT,
      }
    : false,
  entities: [__dirname + '/src/modules/**/*.entity.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['src/migrations/*{.ts,.js}'],
  seeds: ['src/seeders/**.seeder{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default new DataSource(config);
