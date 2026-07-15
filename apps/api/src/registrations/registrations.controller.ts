import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  async create(@Body() createRegistrationDto: CreateRegistrationDto) {
    const registration = await this.registrationsService.create(createRegistrationDto);
    return { success: true, data: registration };
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '15',
  ) {
    const result = await this.registrationsService.findAll(
      Number(page) || 1,
      Number(limit) || 15,
    );
    return { success: true, ...result };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    const registration = await this.registrationsService.update(Number(id), data);
    return { success: true, data: registration };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.registrationsService.remove(Number(id));
    return { success: true };
  }
}
