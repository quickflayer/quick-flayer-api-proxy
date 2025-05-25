import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: '*',
      credentials: true,
    });

    await app.init();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }
  return app;
}

export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance() as (
    req: Request,
    res: Response,
  ) => void;
  return server(req, res);
};
