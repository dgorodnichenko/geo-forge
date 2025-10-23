import { IsNotEmpty, Validate } from "class-validator";
import { KmzFileValidator } from "../validator/kmz-file-validator";

export class KmzUploadFileDTO {
    @IsNotEmpty()
    @Validate(KmzFileValidator)
    file: Express.Multer.File
}