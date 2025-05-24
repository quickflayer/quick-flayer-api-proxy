import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.docker', '.env'],
    }),
    
    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'postgres'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'quick_flayer_user'),
        password: configService.get('DB_PASSWORD', 'dev_password'),
        database: configService.get('DB_DATABASE', 'quick_flayer_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV', 'development') === 'development',
        logging: configService.get('NODE_ENV', 'development') === 'development',
      }),
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute (in milliseconds)
          limit: 100, // 100 requests per minute
        },
      ],
    }),
    
    // Application modules
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
