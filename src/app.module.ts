import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { ResetModule } from './reset/reset.module';

@Module({
  imports: [AuthModule, ResetModule, UsersModule, ArticlesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
