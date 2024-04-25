import { HttpService } from '@nestjs/axios';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';
import configuration from 'src/config/configuration';

import {
  ChatTransform,
  TransformError,
} from 'src/common/transformer/chat.transform';
import { JwtService } from '@nestjs/jwt';

interface Client extends WebSocket {
  uid: number;
}
@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;
  uids: number[] = [];

  get online() {
    return this.uids.length;
  }

  /**
   * websocket连接回调
   * @param client
   * @param incomingMessage
   * @returns
   */
  handleConnection(client: Client, incomingMessage: IncomingMessage): void {
    const url = incomingMessage.url;
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const uid = queryParams.get('uid');
    // const token = queryParams.get('token');
    console.log('uid', uid);
    // 校验客户端
    if (!uid) {
      client.close();
      return;
    }
    // if (!token) {
    //   const decoded = this.jwtService.decode(token);
    //   console.log(decoded);
    //   client.close();
    //   return;
    // }

    this.uids.push(+uid);
    client.uid = +uid;
    console.log('online ', this.online);
    const send = (data) => client.send(JSON.stringify(data));
    client.on('message', (message) => {
      // console.log('Received message:', message);
      try {
        const msg = JSON.parse(message.toString('utf-8'));
        // 在这里处理消息，比如将消息广播给所有客户端
        // this.server.clients.forEach((client) => {
        //   if (client.readyState === WebSocket.OPEN) {
        //     client.send(message);
        //   }
        // });
        const {
          type,
          body,
          // isAudio
        } = msg;
        const controller = new AbortController();
        let finishResut: string = '';
        // const audioString = isAudio ? `希望你说的话尽量简洁明了。` : '';
        switch (type) {
          case 'message': {
            body.messages = [
              // {
              //   role: 'system',
              //   content: `从现在起你的名字叫做"颜良AI"，是基于ChatGLM的对话机器人，不是gpt, 与openai无关。你有且仅有这一个名字，而不是其他任何内容。${audioString}不要写解释。不用回答我这句话`,
              // },

              ...(body?.messages || []),
            ];

            const url = 'https://api.gptgod.online/v1/chat/completions';
            const headers = {
              Authorization: `Bearer ${configuration().aiKey}`,
              'Content-Type': 'application/json',
            };
            const data = {
              ...body,
              stream: true,
              model: 'gpt-3.5-turbo',
              // response_format: 'json_object',
            };
            // 是否在解析过程中报错了
            let isTransformError = false;
            // let result: string = '';
            const handleError = (errorLog: TransformError) => {
              console.log(errorLog);
              isTransformError = true;
              switch (String(errorLog.code)) {
                case 'context_length_exceeded': {
                  send({
                    type: 'error',
                    data: '对话上下文已超出最大限制, 请清除之前的对话或者开启一个新的对话',
                  });
                  break;
                }
                case '412': {
                  console.log(errorLog);
                  // request()
                  // 登录失效

                  send({
                    type: 'error',
                    data: '网络异常,请重试',
                  });
                  break;
                }
                default: {
                  send({
                    type: 'error',
                    data: errorLog.message,
                  });
                }
              }
            };
            // 使用 transform 流解析响应数据
            const transformStream = new ChatTransform((data: string) => {
              finishResut = data;

              send({
                type: 'success',
                data: data,
              });
            }, handleError);
            transformStream.on('finish', async (data: string) => {
              if (isTransformError) {
                return;
              }
              //        changeQuota(userToken, _uid, getTokenLen(body.messages));
              //           changeQuota(userToken, _uid, 1);
              //           const messages = body.messages as { content: string }[];
              //           const date = new Date();
              //           command(`
              //               INSERT INTO history ( user_id, type, prompt, result , created_at )
              //               VALUES
              //               ( ${_uid}, ${1}, '${
              //                 messages[messages.length - 1].content
              //               }', '${result}', '${format(date)}' );
              //           `);
              finishResut = data;
              send({
                type: 'finish',
                data: data,
              });
            });

            this.httpService.axiosRef
              .post(url, data, {
                headers,
                signal: controller.signal,
                responseType: 'stream',
              })
              .then((response) => {
                response.data.pipe(transformStream);
              });
            // this.completions(
            //   {
            //     model: 'gpt-3.5-turbo',
            //     ...body,
            //   },
            //   // controller.signal,
            // ).then((res) => {
            //   client.send(
            //     JSON.stringify({
            //       type: 'line',
            //       data: res,
            //     }),
            //   );
            // });
            break;
          }

          case 'abort': {
            controller.abort();
            send({
              type: 'finish',
              data: finishResut,
            });
            break;
          }
          case 'heart': {
            // ws.emit('heart')
            break;
          }
        }

        // console.log(msg, this.server.clients);
      } catch (error) {
        console.log('error', error);
        client.close();
      }
    });
  }

  handleDisconnect(client: Client): void {
    console.log(`Client disconnected: ${client}`);
    this.uids = this.uids.filter((item) => item !== client.uid);
    // that.clients = that.clients.filter((item) => item.uid !== uid)
    console.log('online ', this.online);
  }
}
