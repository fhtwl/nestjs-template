import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: {
        expiresIn: configuration().jwt.expiresIn,
      },
    }),
  ],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
