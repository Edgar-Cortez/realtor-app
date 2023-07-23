import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(
    { name, phone, email, password }: SignupParams,
    userType: UserType,
  ) {
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
        user_type: userType,
      },
    });

    return this.generateJWT(user.id, user.name);
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    console.log({ user });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    console.log({ isValidPassword });

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.generateJWT(user.id, user.name);
  }

  private generateJWT(id: number, name: string) {
    const tokenExpiration = 86400; // 24 hours
    return jwt.sign(
      {
        id,
        name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: tokenExpiration,
      },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const productString = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    console.log({ productString });

    return bcrypt.hash(productString, 10);
  }
  //5:04:48
}
