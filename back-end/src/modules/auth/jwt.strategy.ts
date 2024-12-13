import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Role } from '@/modules/role/entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  validate = async ({
    iat,
    exp,
    ...payload
  }: UserByAccessToken & {
    iat: number;
    exp: number;
  }) => {
    try {
      const permissions = await this.roleRepository
        .findOne({
          where: { id: payload.role.id },
          relations: ['permissions'],
        })
        .then((role) => {
          return role?.permissions ?? [];
        })
        .catch((e) => {
          console.log(e);
          return null;
        });
      return { ...payload, permissions };
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
