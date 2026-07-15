import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [PrismaModule, RegistrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
