import { Response } from 'express';
import { ProcessResult } from '../interfaces/process-result';
import { ContentType } from '../constants/content-type';

export function sendFileResponse(res: Response, result: ProcessResult, contentType: ContentType): void {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    
    res.sendFile(result.filePath, (err) => {
        result.cleanup(err);
        
        if (err && !res.headersSent) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Failed to download file' });
        }
    });
}