import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health';
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
        console.log('Initializing database connection...');
        
        // Create direct connection to Supabase
        return {
          type: 'postgres',
          url: dbUrl,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV', 'development') === 'development',
          logging: configService.get('NODE_ENV', 'development') === 'development',
          autoLoadEntities: true,
          // Critical for Supabase connection
          ssl: {
            rejectUnauthorized: false
          },
          // Disable native pg-native for better compatibility
          native: false,
          // Disable debug logs
          debug: false,
          // Connection pool configuration
          poolSize: 10,
          // Maximum number of connection retries
          retryAttempts: 10,
          // Retry delay in milliseconds
          retryDelay: 3000,
          connectTimeoutMS: 30000,
          extra: {
            // IPv4 only
            family: 4,
            // Increase timeout
            connectionTimeoutMillis: 30000
          }
        };
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
    
    // Application modules
    HealthModule,
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
