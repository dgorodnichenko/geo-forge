export interface ProcessResult {
    filePath: string;
    filename: string;
    cleanup: (err?: Error) => void;
}