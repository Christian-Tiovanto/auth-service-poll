import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserSeeder } from './seeder/user.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3005;

  const seeder = app.get(UserSeeder);
  await seeder.run();

  app.enableCors({
    origin: true, // Allows all origins. For production, change to your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Endpoint Penitipan Barang')
    .setDescription('List Endpoint Penitipan Barang')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  await app.listen(PORT, '0.0.0.0'); // <-- PENTING BANGET!
}
bootstrap();
