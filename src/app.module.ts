import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'
import { UsersService } from './users/users.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { env } from 'process'
import { AuthGuard } from './auth/auth.guard'

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, AuthGuard],
})
export class AppModule {}
