import express from 'express'
import fileUpload from 'express-fileupload'
import { createReadStream } from 'fs'
import { join } from 'path'
import Db from 'simple-mongo-client'
import { fileFolder, saveFile } from './util.js'


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

   const title = req.body.title
   const file = req.files?.video

   if(!(title && file)) return res.redirect('/failed.html')
    /**
     * video binary
     * title
     */
    console.log({title,file})

    const id = Date.now()
    const ext = file.mimetype.split('/')[1]

    // upload the file
    await saveFile(id,ext,file.data)

    // save the info to db
    const db = await videosDb()
    const saved = await db.save({
        title,
        file: `${id}.${ext}`
    })

    if(saved.success) res.redirect('/thank-you.html')
    else res.status(500).end('something went wrong!')
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

    // create a readable stream to the file
    const fileUrl = join(fileFolder,req.params.filename)
    console.log(`streaming ${fileUrl}...`)

    const fileStream = createReadStream(fileUrl)

    // pipe the stream to our response
    fileStream.pipe(res)

    fileStream.on('end',()=>{
        console.log('stream complete')
    })
})

// delete video
app.delete("/:id",(req,res)=>{

})

app.use((req,res)=>{
    res.redirect('/404.html')
})
https://prod.liveshare.vsengsaas.visualstudio.com/join?3B6FADB0698EE4F9E88D4590A5133C9D2728

app.listen(5000,()=>{
    console.log('listening on port 5000')
})

