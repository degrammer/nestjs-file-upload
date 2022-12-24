## Description

A complete [Nest](https://github.com/nestjs/nest) File Upload Demo using TypeScript, it includes file extension validation example. This example works with Express.js using Multer, read more about it at the [official Nest docs](https://docs.nestjs.com/techniques/file-upload)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Upload a file
This middleware only handles multipart/form-data
```bash
curl http://localhost:3000/file -F 'file=@./file.extension' -F 'name=test'
```

# Configure valid file extensions
Valid extensions and destination folder are configured via env vars.
The **uploads** folder will be used by default, if no destination path is specified.
The destination folder should be created beforehand (this is a requirement by the Multer library).
```bash
DEST_PATH=./uploads VALID_EXTENSIONS=.pdf,.jpg,.png nest start
```
