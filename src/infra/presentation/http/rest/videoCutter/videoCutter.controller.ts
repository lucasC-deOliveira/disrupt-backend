import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from 'src/infra/services/videoCutter.service';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('cut')
  @UseInterceptors(FileInterceptor('file'))
  async cutVideoFromBuffer(
    @UploadedFile() file: Express.Multer.File, // Arquivo enviado como buffer
    @Body('chunkDuration') chunkDuration: number, // Duração de cada parte (em segundos)
  ) {
    try {
      const videoChunks = await this.videoService.splitVideoIntoChunks(file.buffer, chunkDuration);

      // Converter os buffers para base64 antes de retornar (se necessário)
      const chunksBase64 = videoChunks.map(chunk => chunk.toString('base64'));

      return {
        message: 'Vídeo cortado com sucesso',
        chunks: chunksBase64, // Lista com os chunks em base64
      };
    } catch (error) {
      return {
        message: 'Erro ao cortar vídeo',
        error: error.message,
      };
    }
  }
}
