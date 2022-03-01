// import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next';
const formidable = require('formidable');

const form = formidable({ keepExtensions: true });
var mv = require('mv');


export const config = {
    api: {
       bodyParser: false,
    }
};
 
async function Upload(req: NextApiRequest, res: NextApiResponse){
    
    var counter = 0
    var imageObjs: { id: number; name: string; }[] = []
    const data = await new Promise((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {

            var currImage = files.file0
            while (currImage != undefined && counter < 5) {
                var extension = "." + currImage.originalFilename.split('.')[1]
                var newName = `${Date.now().toString()}_${counter}${extension}`
                var imageObj = { id: counter, name: newName }
                imageObjs.push(imageObj)
                var oldPath = currImage.filepath;
                var newPath = `./public/uploads/${newName}`;
                mv(oldPath, newPath, function (err: any) {
                });

                // console.log(imageObj)
                
                counter++
                currImage = files[`file${counter}`]
            }

            res.status(200).json(imageObjs)
        })

        // console.log(imageObjs)

        return res
    })
    
}
export default Upload