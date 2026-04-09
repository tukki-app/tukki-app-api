import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domains/identity/entities/user.entity';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<{ accessToken: string }> {
    const { phone, password } = dto;

    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.phone = :phone', { phone })
      .addSelect('user.password')
      .getOne();

    if (!user || !user.password) {
      throw new UnauthorizedException('Numéro de téléphone ou mot de passe incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Numéro de téléphone ou mot de passe incorrect.');
    }

    const payload = { sub: user.id, role: user.role, phone: user.phone };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
