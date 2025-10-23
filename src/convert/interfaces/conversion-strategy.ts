export interface ConversionStrategy {
    convert(file: Express.Multer.File): Promise<any>;
    getSupportedExtensions(): string[];
    getOutputExtension(): string;
    getMimeTypes(): string[];
}