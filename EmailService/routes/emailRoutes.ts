import { Router } from "express";
import formidable from 'formidable';
import { Request, Response, NextFunction } from "express";
import { readFileSync, unlink, writeFile } from "fs";
import { Buffer } from "buffer";


const router: Router = Router();

router.get("/mail", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json("post on this route");
});

router.post("/mail", (req: Request, res: Response, next: NextFunction) => {

    const form: any = formidable({
        minFileSize: 1,
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024,
        // uploadDir: "./temp",
        // filename(name,ext) {
        //     console.log(path.extname(name));
        //     return name + ext;
        // }
    });

    form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
            next(err);
            return;
        }
        console.log(fields);

        const fileNames: string[] = []

        for (const key in files) {

            const filename : string= files[key][0].originalFilename;
            const rawFile : Buffer = readFileSync(files[key][0].filepath);

            writeFile(`./temp/${filename}`, rawFile , (err) => {
                next(err);
                return;
            });
            fileNames.push(filename);
        }

        //Send mail logic here 
        
        fileNames.forEach(async (element: string) => {

            await unlink(`./temp/${element}`, (err) => {
                next(err);
                return;
            });

        });
        return res.status(200).json({ "message": "all is well" });

    });
});

export default router;

