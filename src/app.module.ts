import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

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
      useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const nodeEnv = configService.get('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';
        const isLocalDev = dbUrl?.includes('localhost') || dbUrl?.includes('127.0.0.1');

        console.log(`Database configuration: ENV=${nodeEnv}, URL=${dbUrl}, isLocalDev=${isLocalDev}`);

        const config = {
          type: 'postgres' as const,
          url: dbUrl,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: nodeEnv === 'development',
          logging: nodeEnv === 'development',
          autoLoadEntities: true,
          // Disable native pg-native for better compatibility
          native: false,
          // Connection pool configuration
          poolSize: 10,
          // Maximum number of connection retries
          retryAttempts: 10,
          // Retry delay in milliseconds
          retryDelay: 3000,
          connectTimeoutMS: 30000,
        };

        // Only add SSL configuration for production or remote databases
        if (isProduction || (!isLocalDev && dbUrl?.includes('postgres'))) {
          console.log('Adding SSL configuration for remote database');
          (config as any).ssl = {
            rejectUnauthorized: false
          };
          (config as any).extra = {
            // IPv4 only
            family: 4,
            // Increase timeout
            connectionTimeoutMillis: 30000
          };
        } else {
          console.log('Using local database without SSL');
        }

        return config;
      },
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
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
})
export class AppModule {}
