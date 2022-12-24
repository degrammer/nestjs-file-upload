import { Body, Controller, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString } from 'class-validator';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AppService } from './app.service';

class FileOptions {
  @IsString()
  name: string;
}

function getValidExtensions(): RegExp {
  const extensions = (process.env.VALID_EXTENSIONS || '.*').split(',').join('|');
  return new RegExp(`([a-z])+(${extensions})$`);
}

function getDestPath(): string {
  return process.env.DEST_PATH || 'uploads';
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        // Known issue: Without using this filter, a file is uploaded even if the file extension is invalid. 
        const isValidExtension = getValidExtensions().test(file.originalname);
        cb(null, isValidExtension);
      },
      storage: diskStorage({
        destination: `./${getDestPath()}`,
        filename(req, file, callback) {
          // Change the file name here if you want, by default we're keeping the original file name
          callback(null, file.originalname);
        },
      }),
    })
  )
  @Post('file')
  uploadFile(
    @Body() body: FileOptions,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: getValidExtensions(),
        })
        .build({
          fileIsRequired: true,
        })
    )
    file: Express.Multer.File,
    @Res() res
  ) {
    const filePath = `${join(__dirname, `../${getDestPath()}`)}/${file.originalname}`;
    res.status(201);
    res.sendFile(filePath);
  }
}
