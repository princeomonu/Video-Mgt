import express from 'express'
import fileUpload from 'express-fileupload'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import Db from 'simple-mongo-client'
import { deleteFile, fileFolder, saveFile } from './util.js'
import cors from 'cors'
import { ObjectId } from 'mongodb'


const videosDb = async ()=>{
    return  await Db.connect('videos',{
        database:'MyData',
        mongoURL:'mongodb://localhost:27018',
    })
}



const app = express()

// body parser
app.use(express.json())
app.use(express.static('client'))
app.use(fileUpload({}))
app.use(cors())

// set view engine to ejs
app.set('view engine','ejs')

app.get('/',async (req,res)=>{
    console.log('new req:/')

    // get all our videos from db
    const db = await videosDb()
    const videos = (await db.getAll()).data

    // render template
    res.render('index',{videos})
})

// upload video
app.post("/upload",async (req,res)=>{
    try {
        
        
            console.log('req:/upload')
        
           const title = req.body.title
           const file = req.files?.video
        
           console.log({header:req.headers['content-type'],body:req.body, title,file})
           
        
           if(!(title && file)) return res.redirect('/failed.html')
            /**
             * video binary
             * title
             */
        
            const id = Date.now()
            const ext = file.mimetype.split('/')[1]
        
            // upload the file
            await saveFile(id,ext,file.data)
        
            console.log('file uploaded!')
        
            // save the info to db
            const db = await videosDb()
            const saved = await db.save({
                title,
                file: `${id}.${ext}`
            })
        
            console.log('file saved!')
        
            if(saved.success) res.send({succcess:true})
            else res.status(500).end('something went wrong!')
    } catch (error) {
        res.status(500).end('something went wrong in the universe')
    }
})

// list all videos
app.get("/all",async (req,res)=>{
    try {
        console.log('new req:all')
        // save the info to db
        const db = await videosDb()
        const all = await db.getAll()
        res.send(all.data)
    } catch (error) {
        res.status(500).end('something went wrong in the universe')
    }

})

// stream video
app.get('/stream/:filename',(req,res)=>{
    try {
        
        const fileUrl = join(fileFolder,req.params.filename)
        console.log(`streaming ${fileUrl}...`)
    
        if(!existsSync(fileUrl)) return res.status(404).end()
    
        const fileStream = createReadStream(fileUrl)
    
        // pipe the stream to our response
        fileStream.pipe(res)
    
        fileStream.on('end',()=>{
            console.log('stream complete')
        })
    } catch (error) {
        res.status(500).end('something went wrong in the universe')
    }

    // create a readable stream to the file
})

// delete video
app.delete("/:id",async (req,res)=>{
    try {
        
        // get the id
        const id = req.params.id
        if(!id) return res.status(400).end('invalid data')
        console.log('deleting video with',id)
    
        // get video info from db
        const db = await videosDb()
        const result = await db.getOne({
            _id: ObjectId(id)
        })
        console.log({result})
        if(!result.success) res.status(404).end('not found')
        console.log({videoInfo:result.data})
    
        // delete the video from db
        const deleted = (await db.delete({
            _id: ObjectId(id)
        })).success
        if(!deleted) res.status(500).end('something went wrong')
        console.log('video deleted from db')
    
        // delete the video files
        const fileDeleted = await deleteFile(result.data.file)
        if(fileDeleted) res.send({success:true})
        else res.status(500).end('something went wrong!')
    } catch (error) {
        res.status(500).end('something went wrong in the universe')
    }

})

app.use((req,res)=>{
    res.redirect('/404.html')
})
https://prod.liveshare.vsengsaas.visualstudio.com/join?3B6FADB0698EE4F9E88D4590A5133C9D2728

app.listen(5000,()=>{
    console.log('listening on port 5000')
})

