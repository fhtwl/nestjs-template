import { Transform } from 'stream';
export interface TransformError {
  code: string;
  message: string;
}

export class ChatTransform extends Transform {
  buffer: string;
  line?: (str: string) => void;
  parsedLine: string;
  handleError: ((errorLog: TransformError) => void) | undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    line?: (str: string) => void,
    error?: (errorLog: TransformError) => void,
  ) {
    super();
    this.buffer = '';
    this.line = line;
    this.parsedLine = '';
    this.handleError = error;
  }

  _transform(
    chunk: { toString: () => any },
    _encoding: any,
    callback: () => void,
  ) {
    const chunkText = chunk.toString();
    // console.log(chunkText)
    if (chunkText.indexOf('data: [DONE]') > -1 || chunkText === 'event: end') {
      callback();
      return;
    }
    // try {
    //   console.log('text', chunkText)
    //   const { error } = JSON.parse(chunkText)
    //   this.handleError && this.handleError(error as TransformError)
    //   callback()
    //   return
    // } catch (error) {
    //   console.log('err', error)
    // }
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const lines = (this.buffer + chunkText).split('\n');
    this.buffer = lines.pop()!;

    for (const line of lines) {
      const parsedLine = parseChatGptResponse(line, this.handleError);
      // const parsedLine = line
      this.parsedLine = this.parsedLine + parsedLine;

      if (parsedLine !== '') {
        this.push(parsedLine);
      }
    }
    this.line && this.line(this.parsedLine);
    callback();
  }

  _flush(callback: () => void) {
    if (this.buffer) {
      const parsedLine = parseChatGptResponse(this.buffer, this.handleError);

      if (parsedLine !== '') {
        this.push(parsedLine + '\n');
      }
    }
    callback();
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
function parseChatGptResponse(
  line: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  errorCallback = (_error: TransformError) => {},
) {
  let parsedLine = '';
  try {
    // chatgpt
    if (line?.length > 20) {
      const json = JSON.parse(`{${line.replace('data', '"data"')}}`);
      if (json.error) {
        errorCallback(json.error as TransformError);
      } else {
        if (json?.data?.choices?.length > 0) {
          parsedLine = json.data.choices[0].delta?.content || '';
        }
      }
    }

    // forefront
    // if (line?.startsWith('data: {"delta":')) {
    //   const json = JSON.parse(`{${line.replace('data', '"data"')}}`)
    //   parsedLine = json.data.delta
    // } else if (line?.startsWith('data: {"error":')) {
    //   const json = JSON.parse(`{${line.replace('data', '"data"')}}`)
    //   errorCallback(json.data.error as TransformError)
    //   parsedLine = 'token过长, 请清除历史记录或者重新开启一个对话'
    // } else if (line?.startsWith('data: {"id"')) {
    //   const json = JSON.parse(`{${line.replace('data', '"data"')}}`)
    //   if (json.error) {
    //     errorCallback(json.error as TransformError)
    //   } else {
    //     if (json?.data?.choices?.length > 0) {
    //       parsedLine = json.data.choices[0].delta?.content || ''
    //     }
    //   }
    // }
  } catch (e) {
    console.error('Error parsing ChatGPT response JSON:', e, line);
    // throw new HttpException(e, line)
  }
  return parsedLine;
}
