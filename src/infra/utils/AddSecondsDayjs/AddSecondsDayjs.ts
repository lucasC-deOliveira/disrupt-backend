import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

@Injectable()
export class AddSecondssDayjs {
  execute(seconds: number): Date {
    return dayjs().add(seconds, 'second').toDate();
  }
}
