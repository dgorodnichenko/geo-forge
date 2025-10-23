export class KmzFileValidator {
    validate(file: Express.Multer.File) {
        if (!file) return false;

        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        if (fileExtension !== 'kmz') {
            return false;
        }

        const allowedMimeTypes = [
            'application/vnd.google-earth.kmz',
            'application/zip',
            'application/x-zip-compressed',
            'application/octet-stream'
        ];

        if (file.mimetype && !allowedMimeTypes.includes(file.mimetype)) {
            return false;
        }

        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            return false;
        }

        return true;
    }

    defaultMessage() {
        return 'File must be a valid KMZ file (max 100mb)';
    }
}