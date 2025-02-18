import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreConfigModule, ConfigEnvironmentType as ENV } from './config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingRecordModule } from './modules/billing-record/billing-record.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    CoreConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [CoreConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ENV>) => {
        const isEnvTest = configService.get('environment') === 'test';
        const config = configService.get<ENV['reporting']>('reporting');
        const database = !isEnvTest ? config.database : config.testing.database;

        return {
          type: 'postgres',
          host: database.host,
          port: database.port ?? 5432,
          username: database.username,
          password: database.password,
          database: database.database,
          ssl: database.ssl
            ? {
                rejectUnauthorized: false,
                ca: database.ssl,
              }
            : false,
          migrations: [`${__dirname}/migrations/*.js`],
          migrationsRun: true,
          // synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging: true, // database.logging,
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };
      },
    }),
    BillingRecordModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
