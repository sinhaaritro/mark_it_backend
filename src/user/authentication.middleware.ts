/*
https://docs.nestjs.com/middleware#middleware
*/

import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

declare global {
  namespace Express {
    interface Request {
      userID: string;
      user: any;
    }
  }
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async use(@Req() request: Request, respose: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer'))
      throw new HttpException(
        { message: 'Missing authorization Header' },
        HttpStatus.BAD_REQUEST,
      );

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await this.userModel.findById(payload.userID);

      if (!user)
        throw new UnauthorizedException('Invalid Username or Password');

      request.userID = payload.userID;
      request.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid Username or Password');
    }
  }
}
