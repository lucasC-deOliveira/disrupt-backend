import { Module } from '@nestjs/common';
import { VideoController } from './videoCutter.controller';
import { VideoService } from 'src/infra/services/videoCutter.service';

@Module({
  imports: [],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoCutterModule {}
