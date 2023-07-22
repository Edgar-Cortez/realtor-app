import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async signup({ email }: SignupParams) {
    // const userExists = await this.prismaService.user.findUnique({ // the email is complaining that it needs to be paired with id or another property
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    console.log({ userExists });

    if (userExists) {
      throw new ConflictException();
    }
  }
}
