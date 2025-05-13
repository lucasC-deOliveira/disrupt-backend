import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { file } from 'tmp-promise';
import * as fs from 'fs/promises';

@Injectable()
export class VideoService {
  /**
   * Splits the input video buffer into 30-second chunks.
   * @param videoBuffer - The video file as a Buffer.
   * @returns An array of Buffers, each representing a 30-second chunk.
   */
  async splitVideoIntoChunks(videoBuffer: Buffer, cutTime: number): Promise<Buffer[]> {
    // Create a temporary file for the input video
    const { path: inputPath, cleanup } = await file({ postfix: '.mp4' });

    // Write the buffer to the temp file
    await fs.writeFile(inputPath, videoBuffer);

    try {
      // Get total duration of the video
      const duration = await this.getVideoDuration(inputPath);

      // Prepare array to hold video chunks
      const chunkBuffers: Buffer[] = [];

       const numberOfSegments = Math.ceil(duration / cutTime);

      // Process each 30-second chunk
      for (let i = 0; i < numberOfSegments; i++) {
        const startTime = i * cutTime;
        const chunk = await this.extractChunk(inputPath, startTime, cutTime);
        chunkBuffers.push(chunk);
      }

      return chunkBuffers;
    } finally {
      cleanup(); // Clean up the input temp file
    }
  }

  /**
   * Gets the total duration of a video in seconds.
   */
  private getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration ?? 0);
      });
    });
  }

  /**
   * Extracts a chunk from the video.
   * @param inputPath - Path to the source video.
   * @param start - Start time in seconds.
   * @param duration - Duration of the chunk in seconds.
   * @returns A Buffer containing the video chunk.
   */
  private async extractChunk(
    inputPath: string,
    start: number,
    duration: number,
  ): Promise<Buffer> {
    // Create a temporary output file
    const { path: outputPath, cleanup } = await file({ postfix: '.mp4' });

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(duration)
        .output(outputPath)
        .on('end', async () => {
          try {
            const chunkBuffer = await fs.readFile(outputPath);
            await cleanup(); // Clean up the output file
            resolve(chunkBuffer);
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => {
          cleanup(); // Clean up in case of failure
          reject(err);
        })
        .run();
    });
  }
}
