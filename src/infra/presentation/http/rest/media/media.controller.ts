import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { BlobStorageService } from "../../../../services/blobStorage.service";

@Controller("/rest/midia")
export class MediaController {
    constructor(private readonly blobStorageService: BlobStorageService) {}

    @Get('/:id/:type')
    async getMedia(
        @Param('id') id: string,
        @Param('type') type: string,
        @Res() res: Response
    ): Promise<void> {
        try {
            const decodedType = decodeURIComponent(type);
            const blob = await this.blobStorageService.getBlob(`${decodedType}/${id}`);
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${type + id}"`,
            });
            blob.pipe(res);
        } catch (error) {
            console.error('Error fetching file:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
