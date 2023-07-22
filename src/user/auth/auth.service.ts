import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';

interface SignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  // signup() {
  //   return 'signed up';
  // }

  async signup({ name, phone, email, password }: SignupParams) {
    // not accepting just email field, yelling it needs more even after I made it unique
    //const userExists = await this.prismaService.user.findUnique({
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    console.log({ userExists });

    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log({ hashedPassword });

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    return user;
  }
  //4:48:58
}
