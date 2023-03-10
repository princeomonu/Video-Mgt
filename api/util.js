import fs, { mkdirSync } from 'fs'
import { join } from 'path'

export const fileFolder = join(process.cwd(),'files')
if(!fs.existsSync(fileFolder)) mkdirSync(fileFolder,{recursive:true})

export const saveFile = (id,ext,buffer)=>{

    return new Promise((resolve, reject)=>{

        fs.writeFile(join(fileFolder,`${id}.${ext}`),buffer,(error)=>{
            if(error) reject(error)
            resolve(true)
        })
    })
}

export const deleteFile = (filename)=>{
    return new Promise((resolve, reject)=>{
        fs.unlink(join(fileFolder,filename),(error)=>{
            if(error) reject(error)
            resolve(true)
        })
    })
}