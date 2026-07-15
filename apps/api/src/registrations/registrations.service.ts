import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    return this.prisma.registration.create({
      data: createRegistrationDto,
    });
  }

  async findAll(page: number = 1, limit: number = 15) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.registration.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.registration.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
